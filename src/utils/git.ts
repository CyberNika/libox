// https://gitlab.com/flippidippi/download-git-repo/-/blob/master/index.js

import { execSync } from "child_process";
import downloadUrl from "download";

interface CloneOptions {
  clone?: boolean;
}

interface DirectRepo {
  type: string;
  url: string;
  checkout: string;
}

interface Repo {
  type: string;
  origin: string;
  owner: string;
  name: string;
  checkout: string;
}

const addProtocol = (origin: string, clone?: boolean) => {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    return clone ? "git@" + origin : "https://" + origin;
  }

  return origin;
};

const normalize = (repo: string): DirectRepo | Repo => {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);

  if (match) {
    const url = match[2];
    const directCheckout = match[3] || "master";

    return {
      type: "direct",
      url: url,
      checkout: directCheckout,
    };
  } else {
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
    match = regex.exec(repo);
    const type = match?.[1] || "github";
    let origin = match?.[2] || null;
    const owner = match?.[3];
    const name = match?.[4];
    const checkout = match?.[5] || "master";

    if (origin == null) {
      if (type === "github") {
        origin = "github.com";
      } else if (type === "gitlab") {
        origin = "gitlab.com";
      } else if (type === "bitbucket") {
        origin = "bitbucket.org";
      }
    }

    return {
      type: type,
      origin: origin || "github.com",
      owner: owner || "",
      name: name || "",
      checkout: checkout,
    };
  }
};

const getArchiveUrl = (repo: Repo, clone?: boolean) => {
  let url = "";
  let origin = addProtocol(repo.origin, clone);

  if (/^git@/i.test(origin)) {
    origin = origin + ":";
  } else {
    origin = origin + "/";
  }

  if (clone) {
    url = origin + repo.owner + "/" + repo.name + ".git";
  } else {
    if (repo.type === "github") {
      url =
        origin +
        repo.owner +
        "/" +
        repo.name +
        "/archive/" +
        repo.checkout +
        ".zip";
    } else if (repo.type === "gitlab") {
      url =
        origin +
        repo.owner +
        "/" +
        repo.name +
        "/repository/archive.zip?ref=" +
        repo.checkout;
    } else if (repo.type === "bitbucket") {
      url =
        origin +
        repo.owner +
        "/" +
        repo.name +
        "/get/" +
        repo.checkout +
        ".zip";
    }
  }

  return url;
};

const download = (repo: string, dest: string, options?: CloneOptions) => {
  const repoData = normalize(repo);
  const url =
    "url" in repoData ? repoData.url : getArchiveUrl(repoData, options?.clone);

  if (options?.clone) {
    // TODO: add clone logic
  } else {
    const downloadOptions = {
      extract: true,
      strip: 1,
      mode: "666",
      headers: {
        accept: "application/zip",
      },
    };

    return downloadUrl(url, dest, downloadOptions);
  }
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

export { init, download, getUser };
