import fs from "fs-extra";
import path from "path";
import yaml from "yaml";

export interface Template {
  name: string;
  description: string;
  github: string;
}

const ROOT = path.resolve(__dirname, "../..");
const PROJECT_ROOT = process.cwd();
const TEMPLATES_ROOT = path.resolve(ROOT, ".templates");
const TEMPLATES: Template[] = yaml.parse(
  fs.readFileSync(path.resolve(ROOT, "templates.yml"), "utf8")
);
export { ROOT, PROJECT_ROOT, TEMPLATES_ROOT, TEMPLATES };
