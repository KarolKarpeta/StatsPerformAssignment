/** 
 * Main function that loads at start
 */
window.onload = function mainFunction() {

    let reposDataMap = fetchReposDataFromHtmlTags();

    removeReposHtmlTags();

    /**
     * For each <repos> tag fetches repos from github api and displays fetched data on website.
     */
    for (let [user, borderDate] of reposDataMap) {
        try {
            fetch(`https://api.github.com/users/${user}/repos`)
            .then(repos => repos.json())
            .then(repos => {
            filterAndDisplayRepos(repos, user, borderDate)
        })
        } catch (error) {
        console.error(error);
        }
    }
}

    /**
    * Fetches user names and update dates from <repos> tags.
    * 
    * @return  {Map[user, borderDate]} Map with fetched data.
    */
function fetchReposDataFromHtmlTags() {
    let repos = document.getElementsByTagName('repos');
    let reposMap = new Map();

    for (let repo of repos) {
        try {
            reposMap.set(repo.getAttribute('data-user'), repo.getAttribute('data-update'));
        } catch (error) {
            console.error(error);
        }
    }

    return reposMap;
}


/**
 * Removes <repos> tags from html document as data are fetched from them yet.
 */
function removeReposHtmlTags() {
    document.getElementById('repos').innerHTML = '';
}

/**
 * Filters repos to have only updated after borderDate ones. Displays them on website.
 * 
 * @param {[]} repos fetched from github api 
 * @param {string} user repos owner
 * @param {string} borderDate given update date
 */
function filterAndDisplayRepos(repos, user, borderDate) {
    let filteredRepos = filterWithUpdateDate(repos, borderDate);
    displayReposInTable(filteredRepos, user, borderDate);
}

/**
 * Filters repos to have only updated after borderDate ones.
 * 
 * @param {[]} repos fetched form github api
 * @param {string} incomingBorderDate given update date
 * @return {[]} filtered repos
 */
function filterWithUpdateDate(repos, borderDate) {
    return repos.filter(repo => new Date(repo.updated_at) > new Date(borderDate));
}

/**
 * Displays repos in table on website.
 * 
 * @param {[]} repos only updated after borderDate
 * @param {string} user
 * @param {string} borderDate
 */
function displayReposInTable(repos, user, borderDate) {
    /**
     * Insert line break and horizontal line between tables.
     */ 
    let reposTag = document.getElementById('repos');
    if(!reposTag.innerHTML == '') reposTag.insertAdjacentHTML('beforeend', `<br><hr>`);
    
    insertReposTableSkeleton(user, borderDate);

    repos.forEach(repoData => {
        insertRepoDataIntoTableRow(repoData, user);
    });

}

/**
 * Inserts table skeleton with headers into html code.
 * 
 * @param {string} user 
 * @param {string} borderDate 
 */
function insertReposTableSkeleton(user, borderDate) {
    document.getElementById('repos').insertAdjacentHTML('beforeend', `
    <div>
        <h4> Repos by: ${user}, updated later than ${borderDate}:</h4>
        <table id='table${user}'>
            <tbody id='tbody${user}'>
                <tr>
                    <th>Repo Name</th>
                    <th>Repo Description</th>
                    <th>Last Update</th>
                    <th>Link</th>
                </tr>
            </tbody>
        </table>
    </div>
        `);
}

/**
 * Inserts single repo data as a table row.
 * 
 * @param {[]} repoData One repo data to be inserted as a table row.
 * @param {string} user 
 */
function insertRepoDataIntoTableRow({name, description, updated_at, clone_url}, user) {
    document.getElementById(`tbody${user}`).insertAdjacentHTML('beforeend', 
    `<tr>
        <td>${name}</td>
        <td>${description}</td>
        <td>${updated_at.substring(0,10)}</td>
        <td><a href='${clone_url}'>Clone link</a></td>
    </tr>`);
}
