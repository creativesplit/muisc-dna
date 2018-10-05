/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var rp = require('request-promise')
const axios = require('axios')
var SpotifyWebApi = require('spotify-web-api-node');

var client_id = '8932cfe6e57c4bf393f1fa7a6983c559'; // Your client id
var client_secret = '8c02b84cee4645d08e2679b7f2ee0b08'; // Your secret
var redirect_uri = 'http://localhost:8888'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } 
  else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

       

        // credentials are optional
        var spotifyApi = new SpotifyWebApi({
        clientId: '8932cfe6e57c4bf393f1fa7a6983c559',
        clientSecret: '8c02b84cee4645d08e2679b7f2ee0b08',
        redirectUri: 'http://www.example.com/callback'
        });
        
        spotifyApi.setAccessToken(access_token);

        spotifyApi.getMySavedTracks({
            limit : 150,
            offset: 0
          })
          .then(function(data) {
            console.log('Done!');
          }, function(err) {
            console.log('Something went wrong!', err);
          });
        
        // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
            
        //   console.log(body);
        // });

        
        // // This is to turn the authorization code into a token with which to pull user data
        // axios.post('https://accounts.spotify.com/api/token',
        //     {
        //         method: 'POST',
        //         headers:{
        //             Authorization: Basic<'8932cfe6e57c4bf393f1fa7a6983c559':'8c02b84cee4645d08e2679b7f2ee0b08'>
        //         }
        //         body:{
        //             grant_type: authorization_code,
        //             code: 'code',
        //             redirect_uri: 'http://localhost:8888'
        //         }
        //     }
        
        // //Gets the user's playlists.  The 'tracks' array should return all the tracks within the playlist
        // fetch('/v1/me/playlists',
        //     {
        //     method: 'POST',
        //     headers:{

        //     }
        //     body: JSON.stringify({
        //         id: String,
        //         name: String,
        //         tracks: Array,
        //         uri: String,        //not sure I need this
        //     }))
        // .then(response => {
        //     //store response in 
        // })

        // axios.get('/v1/me/top/{type}')
        //     {
        //     method: 'GET',
        //     headers:{
        //         authorization: {access_token},


        //     }
        //     body: JSON.stringify({
        //         artist:{
        //             genres: Array,
        //             name: String,
        //             popularity: Number,
        //             uri: String,
        //         },
        //         track: {
        //             artists: Array,
        //             name: String,
        //             popularity: Number,
        //             explicity: Boolean,
        //             id: String,

        //         }

        //     })
        //     console.log()
        //     }

        // )
        // }

        // .ajax(
        //     {
        //       method: "POST",
        //       url: "https://accounts.spotify.com/api/token",
        //       data: {
        //         "grant_type":    "authorization_code",
        //         "code":          code,
        //         "redirect_uri":  'http://localhost:8888',
        //         "client_secret":  '8c02b84cee4645d08e2679b7f2ee0b08',
        //         "client_id":     '8932cfe6e57c4bf393f1fa7a6983c559',
        //       },
        //       success: function(result) {
        //         // handle result...
        //       },
        //     }
        //   )
        //   //Gets the current users playlists
        //   .then(get('/v1/me/playlists', (req,res, next)=>{
        //       res.send('#')
        //   }))
        //   //Gets the tracks within a playlist
        //   .then(get('/v1/playlists/{playlist_id}/tracks', (req,res, next)=>{
        //       res.send(#)
        //   }))
        //   //Gets the user's top artists and tracks
        //   .then(get('/v1/me/top/{type}', (req,res, next)=>{
        //       res.send(#)
        //   }))
        //   //Gets a user's saved tracks
        //   .then(get('/v1/me/tracks', (req,res, next)=>{
        //         res.send(#)
        //   })
        //   //Get a user's followed artists
        //   .then(get('/v1/me/following?type=artist', (req,res)=>{
        //       res.send(#)
        //   }))
        // }


        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
