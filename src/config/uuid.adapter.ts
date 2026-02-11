import { v7 as uuidv7 } from "uuid";

export class UuidAdapter {
  public static v7() {
    return uuidv7();
  }
}
