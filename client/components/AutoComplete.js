export const autoCompleteFunc = (input, userList, SupervisorSet, suggestionsDiv, darkModeStatus) => {
    closeList(suggestionsDiv);

    let supervisorChoice = '';

    if(!input)
        return;

    
    //create the autocomplete div
    let suggestions = document.createElement('div');
    suggestions.setAttribute('id', suggestionsDiv);
  
    //this.parentNode.appendChild(suggestions);

    let supDiv = document.getElementById('sup');
  
    supDiv.appendChild(suggestions);

    for(let i=0; i<userList.length; i++) {
        if(userList[i].toUpperCase().includes(input.toUpperCase())){

            //match found
            let suggestion = document.createElement('div');
            darkModeStatus ? suggestion.setAttribute('id', 'suggestion_list_dark') : suggestion.setAttribute('id', 'suggestion_list');

            darkModeStatus ? suggestion.setAttribute('class', 'suggestions_dark') : suggestion.setAttribute('class', 'suggestions_light');

            suggestion.innerHTML = userList[i];

            suggestion.addEventListener('click', ()=>{
                //input.value = suggestion.innerHTML;
                //setSupervisor(suggestion.innerHTML);
                SupervisorSet(suggestion.innerHTML);
                //supervisorChoice = suggestion.innerHTML;
                closeList(suggestionsDiv);
            });
            suggestion.style.cursor = 'pointer';
            suggestions.appendChild(suggestion);
            
            //return supervisorChoice;
        }
    }

    
}

export const closeList = (suggestions_Div) => {
    let suggestions = document.getElementById(suggestions_Div);
    let supDiv = document.getElementById('sup');

    if(suggestions){
        supDiv.removeChild(suggestions);
    }

}