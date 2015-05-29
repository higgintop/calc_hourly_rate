(function() {

   'use strict';

   var hourlyRate = 0;

  $(function init() {
    $('#addRule').on('click', addRule);
    $('#next').on('click', revealRuleTable);
    $('#calculate').on('click', calcHourlyRate);
  }); // init

  function calcHourlyRate () {
    var $baseRateStr = $('#baseRate').val();

    // guard for base input
    if ($baseRateStr === null || $baseRateStr === "") {
      alert('Invalid Base Rate: Please enter a number');
      return;
    }

    // get info from table
    var baseRate = parseFloat($baseRateStr);
    hourlyRate = baseRate;

    // get array of values from table
    var appliedRules = getAppliedRules();
    console.log('appliedRules are', appliedRules);

    // loop over each value in array and call increaseRate
    // or decreaseRate
    appliedRules.forEach(function(value) {
      console.log("the value is", value);
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

  // NEED TO THINK ABOUT THESE - not best way right now
  function increaseRate(increment){
    hourlyRate += increment;
  }

  function decreaseRate(decrement) {
    if (hourlyRate + decrement < 0) {
      hourlyRate = 0;
    }
    else {
      hourlyRate += decrement;
    }

  }


  function getAppliedRules () {
    // function looks at the table for check marks
    // if checked grab previous cell's value
    var appliedRules = [];
    $("tr.ruleRow").each(function() {
      var $this = $(this)
      var checked = $this.find('td.cellCheckbox :checkbox:checked').length > 0;

      if (checked) {
        var rateStr = $this.find('td.cellRate').html();
        
        // remove '$' and turn string to float
        var rate = parseFloat(rateStr.split('$')[1]);
        appliedRules.push(rate);
      }
    });

    return appliedRules;
  }

  function revealRuleTable (event) {
    event.preventDefault();
    // hide the form 
    $('form').hide();

    // reveal the rule table
    $('.displayRules').show();
  }


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
    var rate = parseFloat($rateStr);

    // append ruleName and corresponding rate to table of rules (initially hidden)
    appendRule($ruleName, rate);

  }

  function appendRule(title, rate) {
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
