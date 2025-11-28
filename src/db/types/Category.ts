import Parse from "parse";

export interface CategoryAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | undefined;
  name: string;
  slug: string;
}

export class Category extends Parse.Object<CategoryAttributes> {
  static className: string = "Category";

  constructor(data?: Partial<CategoryAttributes>) {
    super("Category", data as CategoryAttributes);
  }

  get description(): string | undefined {
    return super.get("description");
  }
  set description(value: string | undefined) {
    super.set("description", value);
  }

  get name(): string {
    return super.get("name");
  }
  set name(value: string) {
    super.set("name", value);
  }

  get slug(): string {
    return super.get("slug");
  }
  set slug(value: string) {
    super.set("slug", value);
  }
}

Parse.Object.registerSubclass("Category", Category);

