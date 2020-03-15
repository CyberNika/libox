import { execSync } from "child_process";
import download from "download";

interface CloneOptions {
  clone?: boolean;
}

const clone = (repo: string, dest: string, options?: CloneOptions) => {
  // https://gitlab.com/flippidippi/download-git-repo/-/blob/master/index.js
  // TODO: support other types
  // const regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
  // const match = regex.exec(repo);
  // const type = match?.[1] || "github";
  const url = `https://github.com/${repo}/archive/master.zip`;

  const downloadOptions = {
    extract: true,
    strip: 1,
    mode: "666",
    headers: {
      accept: "application/zip",
    },
  };

  return download(url, dest, downloadOptions);
};

const init = (dest: string) => {
  execSync("git init", {
    cwd: dest,
  });
};

const getUser = () => {
  const name = execSync("git config user.name")
    .toString()
    .replace("\n", "");
  const email = execSync("git config user.email")
    .toString()
    .replace("\n", "");

  return {
    name,
    email,
  };
};

export { init, clone, getUser };
