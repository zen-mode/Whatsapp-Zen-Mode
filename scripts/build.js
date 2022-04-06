const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const rimraf = require("rimraf");

const PLACEHOLDER_KEY = '%%'

const TEMP_BUILD_DIR = './.temp-build'
const DIST_DIR = './dist';
const BUILD_DIR = './build';
const MANIFEST_PATH = path.join(TEMP_BUILD_DIR, 'manifest.json');

const PLACEHOLDER_ALLOWED_FILE_TYPES = ['.js', '.json', ''];

const RELEASE_ID = 'dbpmpbfpicojogpodnicpjomaojiiocp';
const RELEASE_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqdmPtJBkV3trN7spdNfw9bnN57iwUYcLTElGznIrNRMG1GEAQr9yk5B4KOicP9JxQYgnJW6wOI3vyZC+2t/75ApO3kzKM6lHAdf2lJVMiMr+Fm+hNcpdV0/UsD9RmftTgZxg8U6VzgqhKLFsheZU9vCkvYtNcAa2rCRkVd55kFmJ8qjKsQ+X3ZGYznomyH4BWEjfTt3WU3DBdzyu8cVIJZrACu0nzl8sLQphreNRpBpgUnz78SjlB7+5OiaxqGYrZOdxtAZzGj8iXUejweedlrygCXzxHzui9S7v6D344gdoMPZbwJTchtpRLWMaMAbt4GuXQqCllv9L1zhq67CDdwIDAQAB';

const BETA_ID = 'edpkmlkdnhgboaagheijhfnphkndpekd';
const BETA_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1MJAS9KZkAvZtXJQtrWx5YiG30bxwoebot+I3hACIYffkVrBuOU8uh0hsLkZbprFcU/AJHKWUFUM43bl/zYBh0HEmIJvSG6dtkd6qenoDQNXuKh34tr4SIcxfih/BiEnL+abItsjJF5L5bRVOMn6zXGgmGlB+SAR98NXcgCsUkmIeEgYZ6NJQGyxPsHTF1Uv3QniEwTBT4kMiN8z79j/nVvYEhfNfjC5Eid+RAMzCN5Lfn9v9/DJ/d1o0cxBkrJgcvJiJkKO9NOFubBEQPIbfheXGdvnNsh8+wsvhph/9ssLhZMFucY9EWkdjTfOrM2I2AkoaSc+FJJeGv+DMDss7QIDAQAB';

const RELEASE_NAME='__MSG_extnNameForPublic__'
const BETA_NAME='__MSG_extnNameForTesters__'
const DEBUG_NAME='__MSG_extnNameForDebugLog__'

const BUILD_TYPES = Object.freeze({
  LOCAL_RELEASE: {
    id: 'local-release',
    placeholder: {EXTENSION_GLOBAL_ID: RELEASE_ID},
    manifest: {key: RELEASE_KEY, name: RELEASE_NAME},
    pack: true
  },
  LOCAL_BETA: {
    id: 'local-beta',
    placeholder: {EXTENSION_GLOBAL_ID: BETA_ID},
    manifest: {key: BETA_KEY, name: BETA_NAME},
    pack: true
  },
  WEB_STORE_RELEASE: {
    id: 'web-store-release',
    placeholder: {EXTENSION_GLOBAL_ID: RELEASE_ID},
    manifest: {key: null, name: RELEASE_NAME},
    pack: true
  },
  WEB_STORE_BETA: {
    id: 'web-store-beta',
    placeholder: {EXTENSION_GLOBAL_ID: BETA_ID},
    manifest: {key: null, name: BETA_NAME},
    pack: true
  },
})

const BUILD_TYPE = Object.values(BUILD_TYPES).find(b => b.id === process.env.BUILD_TYPE) || BUILD_TYPES.LOCAL_BETA;

function getManifestJSON() {
  const manifestContent = fs.readFileSync(MANIFEST_PATH);
  return JSON.parse(manifestContent);
}

function setManifestContent(content) {
  fs.writeFileSync(MANIFEST_PATH, content);
}

function getExtensionVersion() {
  return getManifestJSON().version;
}

function applyManifestKeys(keyToValueMap) {
  const manifest = getManifestJSON();
  for (const [key, value] of Object.entries(keyToValueMap)) {
    if (value)
      manifest[key] = value;
    else
      delete manifest[key];
  }
  setManifestContent(JSON.stringify(manifest));
}

function safeFormatPlaceholder(name) {
  if (!name.startsWith(PLACEHOLDER_KEY))
    return PLACEHOLDER_KEY + name + PLACEHOLDER_KEY;
  else
    return name;
}

function String_replaceAll(string, find, replace) {
  return string.replace(new RegExp(find, 'g'), replace);
}

function replacePlaceholders(keyToValueMap, dirname = TEMP_BUILD_DIR,) {
  let placeholders = {};
  Object.keys(keyToValueMap).forEach(
    k => placeholders[safeFormatPlaceholder(k)] = keyToValueMap[k]
  );
  const files = fs.readdirSync(dirname)
    .filter(f => PLACEHOLDER_ALLOWED_FILE_TYPES.includes(path.extname(f)));
  files.forEach(file => {
    const filePath = path.join(dirname, file);
    if (fs.lstatSync(filePath).isFile()) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      let mFileContent = fileContent;
      Object.entries(placeholders).forEach(e => mFileContent = String_replaceAll(mFileContent, ...e));
      if (fileContent != mFileContent) {
        fs.writeFileSync(filePath, mFileContent);
      }
    } else {
      replacePlaceholders(keyToValueMap, filePath);
    }
  });
}

function getBuildArchiveName() {
  return `zen-mode-${getExtensionVersion()}-${BUILD_TYPE.id}`;
}

async function prepareBuildDist() {
  await new Promise(resolve =>
    rimraf(TEMP_BUILD_DIR, resolve));
  fse.copySync(DIST_DIR, TEMP_BUILD_DIR);
}

function packToZip(distFolder, outFolder, buildArchivePath) {
  console.log(`Packaging ${buildArchivePath}`)

  if (!fs.existsSync(outFolder))
    fs.mkdirSync(outFolder, {
      recursive: false
    });

  const writeStream = fs.createWriteStream(buildArchivePath);
  const buildArchive = archiver('zip');

  writeStream.on('warning', (error) => console.error(error));
  writeStream.on('error', (error) => console.error(error));
  writeStream.on('finish', () => console.info('Zip packaging finished'));

  buildArchive.pipe(writeStream);
  buildArchive.directory(distFolder, false);
  buildArchive.finalize();
}

async function build() {
  await prepareBuildDist();

  console.log('Building manifest.json')
  applyManifestKeys(BUILD_TYPE.manifest);
  console.log('Replacing placeholders')
  replacePlaceholders(BUILD_TYPE.placeholder);

  if (BUILD_TYPE.pack) {
    packToZip(TEMP_BUILD_DIR, BUILD_DIR, path.join(BUILD_DIR, `${getBuildArchiveName()}.zip`));
  }
}

console.info('Build info:', {
  buildType: BUILD_TYPE,
  // version: getExtensionVersion()
});

build();

