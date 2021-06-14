/**
 * @description: Creates a blob from arr and downloads it as .csv file.
 * @exampleInput:  [{foo: 1}, {foo: 2}] .
 * @exampleOutput: void .
 * @isPure: File IO.
 * @hasTests: No.
 */
export function download_as_csv(csv, filename) {
  var csvFile;
  var downloadLink;

  csvFile = new Blob(["\ufeff", csv], {
    type: "text/csv",
  });

  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);

  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);

  downloadLink.click();
}
