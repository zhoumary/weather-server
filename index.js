const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {
    res.send('Hello from the weather server!');
});


app.get('/weathers', (req, res) => {
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


app.get('/weathers/:id', (req, res) => {
    let weather_id = req.params.id;
    if (!weather_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid weather id!"
        });
    }

    Connection.query('SELECT * FROM weather_list_table where id=?', weather_id, (err, results, fields) => {
        if (err) {
            throw err;
        }
        return res.send({
            error: false,
            data: results[0],
            message: 'weather instance'
        });
    })
})

app.get('/weathers/add', (req, res) => {
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


app.post('/weather', (req, res) => {
    let { time, city, temparature } = req.body;
    if (!city || !time) {
        return res.status(400).send({
            error: true,
            message: "Please provide weather data!"
        })
    }
    const INSERT_WEATHER = `INSERT INTO weather_list_table SET ?`;
    Connection.query(INSERT_WEATHER, {
        time: time,
        city: city,
        temparature: temparature
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New weather has been created!"
        })
    })
});


app.put('/weather/:id', (req, res) => {
    let { time, city, temparature } = req.body;
    let weather_id = req.params.id;
    if (!time || !city || !weather_id) {
        return res.status(400).send({
            error: true,
            message: "Please provider related weather data!"
        })
    }

    const UPDATE_WEATHER = `UPDATE weather_list_table SET ? WHERE id= ?`;
    Connection.query(UPDATE_WEATHER, [{
        time: time,
        city: city,
        temparature: temparature
    }, weather_id], (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "weather has been updated successfully!"
        })
    })
})


app.listen(4000, () => {
    console.log('Weather Server listening on port 4000');
});

module.exports = app;




