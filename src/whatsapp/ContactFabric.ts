import {Contact} from "./model/Contact";

export class ContactFabric {
  static fromWWAContact(wwaContact: any): Contact {
    return {
        id: wwaContact.id,
        displayName: wwaContact.displayName
    }
  }
}
