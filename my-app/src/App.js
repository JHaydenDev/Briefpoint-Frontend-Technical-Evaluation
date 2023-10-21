import React, { useState } from "react";

function App() {
  //I create the states needed for functionality at the top of the function.
  const [movies, setMovies] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");

  //My initial thought was to then create a useEffect that watches the states set on line 5 & 6, but given the simplicity of the app, just executing handlers via functions is less cumbersome.

  //Simple imput handler that when injected in the onChange event of the input sets the movie title
  const movieInputHandler = (event) => {
    setMovieTitle(event.target.value);
  };

  //This handler was actually fun for me.  I initially had a wierd filter function that worked but ultimatly wasn't the best for the situation.  After looking around a bit I found the .some() method which ended being much more performative and accomplished checking the movies state with much less code.  I could of also used the .includes()
  const addMovieHandler = () => {
    //I realize this was an optional task but as I understand, the app I would be hired to maintain and improve takes in a lot of data from an api, so I felt it pertinent to show I know how to handle api calls in a React app.

    //Once the call is made the "data" is returned.  Then I extract the title and year.  I then create a new const that interpolates the title and year dynamically.
    fetch(`https://dimt.com?search=${movieTitle}`)
      .then((response) => response.json())
      .then((data) => {
        const { title, year } = data;
        const newMovie = { title: `${title} (${year})` };

        // using the spread operator I then use the setMovies hook to first take in the previos movies list using the spread operator (...movies), and then adds the newly created const above to the state.
        setMovies([...movies, newMovie]);
        setMovieTitle("");
        console.log(movies, "movies");
      })
      //Obviously since its a fake call, it will fail and the the catch will execute.
      .catch((error) => {
        console.error("API call failed: ", error);

        //This is were we generate the random year.  I set the reandom year.  If you want to see the error message for adding the same movie and year take out the *20 part of the calculation.  this will result in the year being set at 2000.
        const fakeYear = 2000 + Math.floor(Math.random() * 20);
        const newMovie = { title: `${movieTitle} (${fakeYear})` };

        // this is where the check to see if the movie was already added is done.  If you want to quickly test this, there is no validation to see if the input has any characters so the app will just add random years to the list.  Eventually by clicking the submit button you will trigger the alert because it will add the same empty input + year.
        if (movies.some((movie) => movie.title === newMovie.title)) {
          alert("You have added this movie already!");
          return;
        } else {
          setMovies([...movies, newMovie]);
          console.log(movies, "movies");
          console.log(newMovie, "new movie");
        }
        setMovieTitle("");
      });
  };

  //This is just a simple handler that removes the movie from the list by resetting the Movies state by first looking for the movie's selected title via the filter function.
  const removeMovieHandler = (movieTitle) => {
    const updatedMovies = movies.filter((movie) => movie.title !== movieTitle);
    setMovies(updatedMovies);
  };

  return (
    <div>
      <h1>Movies I want to see</h1>
      <input
        type="text"
        placeholder="Add a movie"
        value={movieTitle}
        onChange={movieInputHandler}
      />
      <button onClick={addMovieHandler}>Submit</button>
      <ul>
        {/* This function takes the movies state variable and maps the relevent values from the object to the jsx li elements and renders them dynamically */}
        {movies.map((movie, i) => (
          <li key={i}>
            {movie.title}
            <button onClick={() => removeMovieHandler(movie.title)}>
              Seen it!
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
