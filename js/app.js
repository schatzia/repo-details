var showError = function(error){
    var errorElem = $('.template .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};

var showSearchResults = function(query, resultNum) {
    var results = resultNum + ' results for <strong>' + query + '</strong>';
    return results;
};

var getRepos = function(name){

// the parameters we need to pass in our request to GitHub Jobs API
    
    var request = {
        q: name
    }

    $.ajax(
    {
        url: "https://api.github.com/search/repositories",
        data: request,
        dataType: "json",
        method: "GET"
    })
    .done(function(result){ //this waits for the ajax to return with a succesful promise object
        if(request.q){
            var searchResults = showSearchResults('Name: ' + request.q, result.items.length);
        }
        

        $('.search-results').html(searchResults);

        $.each(result.items, function(i, item) {
            var repo = showRepo(item);
            $('#results').append(repo);
        });
    })
    .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
        var errorElem = showError(error);
        $('#results').append(errorElem);
    });
};

var getIssues = function(item){

    var request = {
        q: "repo:"+item.full_name,
        sort: item.created_at
    }
 
    // https://api.github.com/search/issues?q=repo:twbs/bootstrap

    $.ajax(
    {
        url: "https://api.github.com/search/issues",
        data: request,
        dataType: "json",
        method: "GET"
    })
    .done(function(result){ //this waits for the ajax to return with a succesful promise object
        if(request.q){
            var searchResults = showSearchResults('Name: ' + request.q, result.length);
        }
        

        $('.search-issues').html(searchResults);

        $.each(result.items, function(i, item) {
            var issue = showIssue(item);
            $('#issues').append(issue);
        });
    })
    .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
        var errorElem = showError(error);
        $('#results').append(errorElem);
    });
}

var showRepo = function(item){
    // console.log(item);
    var repoItem = $('.template .result-repo').clone();
    // console.log(item);
       
    var repoTitle = repoItem.find('.title');
    repoTitle.text(item.name);
    //console.log(jobTitle.val());

    var repoURL = repoItem.find('.url a');
    repoURL.attr('href', item.html_url);
    repoURL.text(item.html_url);
    
    var repoDescription = repoItem.find('.description');
    repoDescription.append(item.description);

    var forks = repoItem.find('.forks');
    forks.text(item.forks_count);

    var stargazers = repoItem.find('.stargazers');
    stargazers.text(item.stargazers_count);

    var open_issues = repoItem.find('.open_issues');
    open_issues.text(item.open_issues_count);

    getIssues(item);
    
    return repoItem;
};

var showIssue = function(item){
    // console.log(item);
    var issueItem = $('.template .result-issue').clone();
    // console.log(item);
       
    var issueTitle = issueItem.find('.issue_title');
    issueTitle.text(item.title);
    //console.log(jobTitle.val());

    /* var repoURL = issueItem.find('.url a');
    repoURL.attr('href', item.html_url);
    repoURL.text(item.html_url);
    
    var repoDescription = issueItem.find('.description');
    repoDescription.append(item.description);

    var forks = issueItem.find('.forks');
    forks.text(item.forks_count);

    var stargazers = issueItem.find('.stargazers');
    stargazers.text(item.stargazers_count);

    var open_issues = issueItem.find('.open_issues');
    open_issues.text(item.open_issues_count);
    */
    
    return issueItem;
};

$(document).ready(function(){
    $('#search-form').submit(function(event){
        event.preventDefault();
        $('#results').html('');
        var name = $(this).find("input[name='search-term']").val();
        getRepos(name);
    });
});