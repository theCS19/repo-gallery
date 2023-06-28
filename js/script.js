//Profile info div
const overview = document.querySelector(".overview");
const username = "theCS19";
const repoList = document.querySelector(".repo-list");
const repoClass = document.querySelector(".repos");
const dataClass = document.querySelector(".repo-data");
const hideButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const apiFetch = async function () {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    console.log(data);
    displayInfo(data);
};

apiFetch();

const displayInfo = function(data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(div);
    repoFetch();
};

const repoFetch = async function () {
  const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  console.log(repoData);
  repoDisplay(repoData);
};

const repoDisplay = function(repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  };
};

repoList.addEventListener("click", function(e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getInfo(repoName);
  }
});

const getInfo = async function(repoName) {
  const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  };
  
  showInfo(repoInfo, languages);
};

const showInfo = function(repoInfo,languages) {
  dataClass.innerHTML = "";
  dataClass.classList.remove("hide");
  repoClass.classList.add("hide");
  hideButton.classList.remove("hide");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  dataClass.append(div);
  
}

hideButton.addEventListener("click", function() {
  repoClass.classList.remove("hide");
  dataClass.classList.add("hide");
  hideButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const lowerSearch = searchText.toLowerCase();

  for (const repo of repos) {
    const lowerRepos = repo.innerText.toLowerCase();
    if (lowerRepos.includes(lowerSearch)) {
      repo.classList.remove("hide");
    }
    else {
      repo.classList.add("hide");
    }
  }
});