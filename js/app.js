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
    };

    $.ajax(
    {
        url: "https://api.github.com/search/repositories",
        data: request,
        dataType: "jsonp",
        type: "GET",
        page: 2
    })
    .done(function(result){ //this waits for the ajax to return with a succesful promise object
        if(request.name){
            var searchResults = showSearchResults('Name: ' + request.name, result.length);
        }
        

        $('.search-results').html(searchResults);

        $.each(result, function(i, item) {
            var repo = showRepo(item);
            $('#results').append(repo);
        });
    })
    .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
        var errorElem = showError(error);
        $('#results').append(errorElem);
    });
};

var showRepo = function(item){
    var repoItem = $('.template .result-repo').clone();
    // console.log(item);
     open issues count
    
    var repoTitle = repoItem.find('.title');
    repoTitle.text(item.name);
    //console.log(jobTitle.val());

    var repoURL = repoItem.find('.url a');
    repoURL.attr('href', item.html_url);
    
    var repoDescription = repoItem.find('.description');
    repoDescription.append(item.description.substr(0,300)+'...');

    var forks = repoItem.find('.forks');
    forks.text(item.forks_count);

    var stargazers = repoItem.find('.stargazers');
    stargazers.text(item.stargazers_count);

    var open_issues = repoItem.find('.open_issues');
    open_issues.text(item.open_issues_count);
    
    return repoItem;
};

$(document).ready(function(){
    $('#search-form').submit(function(event){
        event.preventDefault();
        $('#results').html('');
        var name = $(this).find("input[name='search-term']").val();
        getRepos(name);
    });
});