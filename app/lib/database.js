module.exports = (function() {
	
	var api = {};
	
	//Para instalar um db: 
	Ti.Database.install('dbMovies', 'dbMoviesInstalled');
	var db = Ti.Database.open('dbMovies');
	
	db.execute('CREATE TABLE IF NOT EXISTS movies(' + 
								'imdbID TEXT PRIMARY KEY, ' +
								'title TEXT, ' +
								'released TEXT, ' +
								'runtime TEXT, ' +
								'genre TEXT, ' +
								'director TEXT, ' +
								'writer TEXT, ' +
								'actors TEXT, ' +
								'plot TEXT, ' +
								'language TEXT, ' +
								'country TEXT, ' +
								'awards TEXT, ' +
								'poster TEXT, ' +
								'type TEXT, ' +
								'boxOffice TEXT, ' +
								'production TEXT, ' +
								'website TEXT)');
								
	db.close();
	
	api.addMovie = function(/* objeto */ movie) {
		
		var _db = Ti.Database.open('dbMovies');
		
		_db.execute('INSERT INTO movies (imdbID, title, released, runtime, genre, director, writer, actors, plot, language, country, awards, poster, type, boxOffice, production, website )' + 
			'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
			movie.imdbID, movie.Title, movie.Released, movie.Runtime, movie.Genre, movie.Director, movie.Writer, 
			movie.Actors, movie.Plot, movie.Language, movie.Country, movie.Awards, movie.Poster, movie.Type, 
			movie.BoxOffice, movie.Production, movie.Website);
			
		var lastRow = _db.lastInsertRowId; 
		
		_db.close();
		
		return lastRow
	};
	
	api.deleteMovie = function( imdbID ) {
		
		var _db = Ti.Database.open('dbMovies');
		
		_db.execute('DELETE FROM movies WHERE imdbID=?', imdbID );
			
		var lastRow = _db.lastInsertRowId; 
		
		_db.close();
		
		return lastRow
	};
	
	api.listMovies = function() {
		
		var _db = Ti.Database.open('dbMovies');
		
		var movies = [];
		
		//Ti.Database.ResultSet
		var resultado = _db.execute('SELECT * FROM movies');
		
		while(resultado.isValidRow()) {
			
			movies.push({
				imdbID: resultado.fieldByName('imdbID'),
				title: resultado.fieldByName('title'),
				released: resultado.fieldByName('released'),
				runtime: resultado.fieldByName('runtime'),
				genre: resultado.fieldByName('genre'),
				director: resultado.fieldByName('director'),
				writer: resultado.fieldByName('writer'),
				actors: resultado.fieldByName('actors'),
				plot: resultado.fieldByName('plot'),
				language: resultado.fieldByName('language'),
				country: resultado.fieldByName('country'),
				awards: resultado.fieldByName('awards'),
				poster: resultado.fieldByName('poster'),
				type: resultado.fieldByName('type'),
				boxOffice: resultado.fieldByName('boxOffice'),
				production: resultado.fieldByName('production'),
				website: resultado.fieldByName('website')
			});
			
			resultado.next();
		}
		
		resultado.close();
		_db.close();
		
		return movies;
	};
	
	return api;
})();