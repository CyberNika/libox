import path from "path";
import chalk from "chalk";
import { spawnSync } from "child_process";

const install = async (dir: string) => {
  console.log("");
  console.log(chalk.blueBright(" ○ 安装依赖"));
  console.log("");

  spawnSync("npm", ["install"], {
    cwd: path.resolve(process.cwd(), dir),
    env: process.env,
    stdio: "inherit",
  });
};

export default install;
