const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_WEATHER = 'SELECT * FROM weather_list_table';
const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Zyw@422312!',
    database: 'react-weather-db'
});
Connection.connect(err => {
    if (err) {
        return err;
    }
});

console.log(Connection);

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from the weather server!');
});


app.get('/weather', (req, res) => {
    Connection.query(SELECT_ALL_WEATHER, (err, weather) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                data: weather
            })
        }
    });
});

app.get('/weather/add', (req, res) => {
    const { time, city, temparature } = req.query;
    const INSERT_WEATHER_QUERY = `INSERT INTO weather_list_table(time, city, temparature) VALUES('${time}', '${city}', '${temparature}')`;
    Connection.query(INSERT_WEATHER_QUERY, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send('succesfully create weather');
        }
    });
});


app.post('/weather/create', (req, res) => {

});


app.listen(4000, () => {
    console.log('Weather Server listening on port 4000');
});