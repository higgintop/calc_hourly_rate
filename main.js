(function() {

   'use strict';

   var hourlyRate = 0;

  $(function init() {
    $('#addRule').on('click', addRule);
    $('#next').on('click', revealRuleTable);
    $('#calculate').on('click', calcHourlyRate);
  }); 

  // ***********************************************
  // Goal: grab the value in Base Rate input field
  //       once inputted value is valid
  //       Then get the values of the 'checked'
  //       values in table and call increaseRate
  //       or decreaseRate accordingly
  // ***********************************************
  function calcHourlyRate () {
    var $baseRateStr = $('#baseRate').val();

    // guard for base input
    if ($baseRateStr === null || $baseRateStr === "") {
      alert('Invalid Base Rate: Please enter a number');
      return;
    }

    // get info from table
    var baseRate = parseInt($baseRateStr);

    if (baseRate < 0) {
      alert('Invalid Base Rate: Please enter a non-negative value');
      return;
    } else {
      hourlyRate = baseRate;
    }

    // get array of values from table
    var appliedRules = getAppliedRules();

    // loop over each value in array and call increaseRate
    // or decreaseRate
    appliedRules.forEach(function(value) {
      if (value < 0) {
        decreaseRate(value);
      }
      else {
        increaseRate(value);
      }
    });

    $('.displayTotal').empty();
    $('.displayTotal').append('<h2>Final Rate: $'+hourlyRate+'</h2>');

  }

  // ************************************
  // Goal: pass in the increment value
  //       to update the hourly rate
  // ************************************
  function increaseRate(increment){
    hourlyRate += increment;
  }
  // ************************************
  // Goal: pass in the decrement value
  //       to update the hourly rate
  // ************************************
  function decreaseRate(decrement) {
    if (hourlyRate + decrement < 0) {
      hourlyRate = 0;
    }
    else {
      hourlyRate += decrement;
    }

  }

  // ***********************************************
  // Goal:   check table for 'checked' checkboxes
  //         if 'checked' grab previous cell's 
  //         value (rate) and push onto array
  // Return: array
  // ***********************************************
  function getAppliedRules () {
    var appliedRules = [];
    $("tr.ruleRow").each(function() {
      var $this = $(this)
      var checked = $this.find('td.cellCheckbox :checkbox:checked').length > 0;

      if (checked) {
        var rateStr = $this.find('td.cellRate').html();
        
        // remove '$' and turn string to float
        var rate = parseInt(rateStr.split('$')[1]);
        appliedRules.push(rate);
      }
    });

    return appliedRules;
  }

  // ***********************************************
  // Goal: hide the rule's form and display the 
  //       rule table
  // ***********************************************
  function revealRuleTable (event) {
    event.preventDefault();
    // hide the form 
    $('.formView').hide();

    // reveal the rule table
    $('.displayRules').show();
  }

  // ***********************************************
  // Goal: method called when 'Add Rule' btn clicked
  // ***********************************************
  function addRule (event) {
    event.preventDefault();

    // retrieve values from input fields
    var $ruleName = $('#ruleName').val();
    var $rateStr = $("#rate").val();

    // guard/alert for rule name input
    if ($ruleName === null || $ruleName === ""){
      alert("Invalid Rule Name");
      return;
    }
    // guard/alert for rate input
    if($rateStr === null || $rateStr === "") {
      alert('Invalid Rate of Cost: Please enter a number');
      return;
    }

    // empty the input fields
    $('#ruleName').val('');
    $("#rate").val('');

    // convert rateStr to float
    var rate = parseInt($rateStr);

    // append ruleName and corresponding rate to table of rules (initially hidden)
    appendRuleToTable($ruleName, rate);

  }

  // ***********************************************
  // Goal: use jQuery to append a new <tr> to 
  //       table of rules
  // ***********************************************
  function appendRuleToTable(title, rate) {
    // make a table row
    var $tr = $('<tr class="ruleRow"></tr>');

    // make table cells
    var $titleCell = $('<td class="cellTitle">'+ title +'</td>');
    var $rateCell = $('<td class="cellRate">$'+ rate +'</td>');
    var $checkboxCell = $('<td class="cellCheckbox"><input type="checkbox" name="applyRule"/></td>');

    // append table cells to table row
    $tr.append($titleCell);
    $tr.append($rateCell);
    $tr.append($checkboxCell);

    // append table row to tbody element
    $('tbody').append($tr);
  }

})();
