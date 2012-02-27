paige_edition = true
DEBUG = false

$(document).ready ->

    # Run some debug default code for styling
    if(DEBUG)
        console.log("Debug Mode...")
        movie_title = "Rent"
        queryMovie(movie_title)

    # Make sure only numbers are entered for the year born
    $(".numbers-only").keydown (event) ->
      if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
        return
      else
        event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

    # Run the Calculation
    $('#run-calculate').click ->
      resetCalculation()

      # disable the go button
      $('#run-calculate').attr('disabled','disabled')
      movie_title = $('#movie-title').val()
      queryMovie(movie_title)

    $('.generic-toggle a').click ->
      toggleEdition()

      false

resetCalculation= ->
  $('.calculate_loading').removeClass('hide')
  $('.calculate-results').addClass('hide')
  $('.calculate-error').addClass('hide')
  $('.paige-photo').addClass('hide')


toggleEdition= ->
  $('.generic-toggle li').toggleClass('hide')
  # toggle the paige edition
  $('.generic-edition').toggleClass('hide')
  # toggle the generic edition
  $('.paige-edition').toggleClass('hide')

  #hide results
  $('.calculate_loading').addClass('hide')
  $('.calculate-results').addClass('hide')

  # set the global variable if generic is hidden (aka its current...all backwards)
  if $('.generic-toggle li.hide').hasClass('generic')
    paige_edition = false

# checks to see if its the generic app or the paige app to get year born
getYearBorn=->
  # hidden is the opposite of the current on, this is kind of misleading
  if paige_edition
    1989
  else
    parseInt($('#year-born').val())


# call on the imdb api to query the given movie title
queryMovie=(movie_title)->
  imdb_api_url = "http://www.imdbapi.com/?"
  full_api_url = "#{imdb_api_url}t=#{movie_title}"

  $.ajax
    url: full_api_url
    cache: false
    success: (html) ->
      # TODO check for response error

      json = $.parseJSON(html)

      if(json.Response == "Parse Error")
        $('.calculate-error').removeClass('hide')
        $('.calculate_loading').addClass('hide')
        $('.calculate-results').addClass('hide')

      age = json.Year - getYearBorn()

      # Post Movie Results
      $('.movie-year').html(json.Year)
      $('.movie-title').html(json.Title)
      $('.movie-poster').attr('src', json.Poster)
      # Post Age Results
      if ( age < 0)
        results_content = "not even born yet!"
      else if (age == 0)
        results_content = "just a babay!"
      else
        results_content = "#{age} Years Old."

      if paige_edition
        photoOnAge(age)

      $('#movie_v_age_results').html(results_content)
      $('.calculate_loading').addClass('hide')
      $('.calculate-results').removeClass('hide')
      $('#run-calculate').removeAttr('disabled')

# display a in the paige-photo class
displayPhoto=(photo) ->
  $('.paige-photo').attr('src', photo)
  $('.paige-photo').removeClass('hide')

# Show a photo based on the age set in the equation
photoOnAge=(age)->
  images_folder = "./images"
  if (age >=0 && age < 1)
    displayPhoto("#{images_folder}/baby.jpg")
  else if (age > 1 && age < 6)
    displayPhoto("#{images_folder}/young.jpg")
  else if(age >= 6 && age < 10)
    displayPhoto("#{images_folder}/elementary.jpg")
  else if (age >= 10 && age < 14)
    displayPhoto("#{images_folder}/middleschool.jpg")
  else if (age >= 14 && age < 21)
    displayPhoto("#{images_folder}/highschool.jpg")
  else if (age > 21)
    displayPhoto("#{images_folder}/collegeplus.jpg")