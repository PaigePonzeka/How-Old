(function() {
  var DEBUG, displayPhoto, getYearBorn, paige_edition, photoOnAge, queryMovie, resetCalculation, toggleEdition;

  paige_edition = true;

  DEBUG = false;

  $(document).ready(function() {
    var movie_title;
    if (DEBUG) {
      console.log("Debug Mode...");
      movie_title = "Rent";
      queryMovie(movie_title);
    }
    $(".numbers-only").keydown(function(event) {
      if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {} else {
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
          return event.preventDefault();
        }
      }
    });
    $('#run-calculate').click(function() {
      resetCalculation();
      $('#run-calculate').attr('disabled', 'disabled');
      movie_title = $('#movie-title').val();
      return queryMovie(movie_title);
    });
    return $('.generic-toggle a').click(function() {
      toggleEdition();
      return false;
    });
  });

  resetCalculation = function() {
    $('.calculate_loading').removeClass('hide');
    $('.calculate-results').addClass('hide');
    $('.calculate-error').addClass('hide');
    return $('.paige-photo').addClass('hide');
  };

  toggleEdition = function() {
    $('.generic-toggle li').toggleClass('hide');
    $('.generic-edition').toggleClass('hide');
    $('.paige-edition').toggleClass('hide');
    $('.calculate_loading').addClass('hide');
    $('.calculate-results').addClass('hide');
    if ($('.generic-toggle li.hide').hasClass('generic')) {
      return paige_edition = false;
    }
  };

  getYearBorn = function() {
    if (paige_edition) {
      return 1989;
    } else {
      return parseInt($('#year-born').val());
    }
  };

  queryMovie = function(movie_title) {
    var full_api_url, imdb_api_url;
    imdb_api_url = "http://www.imdbapi.com/?";
    full_api_url = "" + imdb_api_url + "t=" + movie_title;
    return $.ajax({
      type: "GET",
      url: full_api_url,
      dataType: "jsonp",
      cache: false,
      success: function(json) {
        var age, results_content;
        if (json.Response === "Parse Error") {
          $('.calculate-error').removeClass('hide');
          $('.calculate_loading').addClass('hide');
          $('.calculate-results').addClass('hide');
        }
        age = json.Year - getYearBorn();
        $('.movie-year').html(json.Year);
        $('.movie-title').html(json.Title);
        if (age < 0) {
          results_content = "not even born yet!";
        } else if (age === 0) {
          results_content = "just a babay!";
        } else {
          results_content = "" + age + " Years Old.";
        }
        if (paige_edition) photoOnAge(age);
        $('#movie_v_age_results').html(results_content);
        $('.calculate_loading').addClass('hide');
        $('.calculate-results').removeClass('hide');
        return $('#run-calculate').removeAttr('disabled');
      }
    });
  };

  displayPhoto = function(photo) {
    $('.paige-photo').attr('src', photo);
    return $('.paige-photo').removeClass('hide');
  };

  photoOnAge = function(age) {
    var images_folder;
    images_folder = "./images";
    if (age >= 0 && age < 1) {
      return displayPhoto("" + images_folder + "/baby.jpg");
    } else if (age > 1 && age < 6) {
      return displayPhoto("" + images_folder + "/young.jpg");
    } else if (age >= 6 && age < 10) {
      return displayPhoto("" + images_folder + "/elementary.jpg");
    } else if (age >= 10 && age < 14) {
      return displayPhoto("" + images_folder + "/middleschool.jpg");
    } else if (age >= 14 && age < 21) {
      return displayPhoto("" + images_folder + "/highschool.jpg");
    } else if (age > 21) {
      return displayPhoto("" + images_folder + "/collegeplus.jpg");
    }
  };

}).call(this);
