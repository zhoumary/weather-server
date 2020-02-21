const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();


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


/*
    API for Weather CRUD begins
*/

app.get('/weathers', (req, res) => {
    const SELECT_ALL_WEATHER = 'SELECT * FROM weather_list_table';
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
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New weather has been created!"
        })
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


app.delete('/weather/:id', (req, res) => {
    let weather_id = req.params.id;
    if (!weather_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide the weather you want to delete!"
        })
    }

    const DELETE_WEATHER = `DELETE FROM weather_list_table WHERE id = ?`;
    Connection.query(DELETE_WEATHER, [weather_id], (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "Delete the weather successfully!"
        })
    })
})

/*
    API for Weather CRUD ends
*/



/*
    API for TouristCity CRUD begins
*/

// get tourist_city
app.get('/touristCities', (req, res) => {
    const SELECT_ALL_TOURCITY = 'SELECT * FROM tourist_city';
    Connection.query(SELECT_ALL_TOURCITY, (err, cities) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                data: cities
            })
        }
    });
});

app.get('/touristCities/:id', (req, res) => {
    let touristCity_id = req.params.id;
    if (!touristCity_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid Tourist City id!"
        });
    }

    Connection.query('SELECT * FROM tourist_city where id=?', touristCity_id, (err, results, fields) => {
        if (err) {
            throw err;
        }
        return res.send({
            error: false,
            data: results[0],
            message: 'Has get the specific Tourist City successfully!'
        });
    })
})

// create tourist_city
app.post('/touristCity', (req, res) => {
    let { tourist_city_code, tourist_city_name, tourist_city_intro, tourist_province_code, tourist_province_name, tourist_country_code, tourist_country_name } = req.body;
    if (!tourist_city_code || !tourist_province_code) {
        return res.status(400).send({
            error: true,
            message: "Please provide Tourist City data!"
        })
    }
    const INSERT_TOURCITY = `INSERT INTO tourist_city SET ?`;
    Connection.query(INSERT_TOURCITY, {
        tourist_city_code: tourist_city_code,
        tourist_city_name: tourist_city_name,
        tourist_city_intro: tourist_city_intro,
        tourist_province_code: tourist_province_code,
        tourist_province_name: tourist_province_name,
        tourist_country_code: tourist_country_code,
        tourist_country_name: tourist_country_name
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New Tourist City has been created!"
        })
    })
});

// edit tourist_city
app.put('/touristCity/:id', (req, res) => {
    let { tourist_city_code, tourist_city_name, tourist_city_intro, tourist_province_code, tourist_province_name, tourist_country_code, tourist_country_name } = req.body;
    let touristCity_id = req.params.id;
    if (!tourist_city_code || !tourist_province_code || !touristCity_id) {
        return res.status(400).send({
            error: true,
            message: "Please provider related Tourist City data!"
        })
    }

    const UPDATE_TOURCITY = `UPDATE tourist_city SET ? WHERE id= ?`;
    Connection.query(UPDATE_TOURCITY, [{
        tourist_city_code: tourist_city_code,
        tourist_city_name: tourist_city_name,
        tourist_city_intro: tourist_city_intro,
        tourist_province_code: tourist_province_code,
        tourist_province_name: tourist_province_name,
        tourist_country_code: tourist_country_code,
        tourist_country_name: tourist_country_name
    }, touristCity_id], (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "The Tourist City has been updated successfully!"
        })
    })
})


/*
    API for TouristCity CRUD ends
*/



/*
    API for City Points CRUD begins
*/
// get City Points
app.get('/cityPoints', (req, res) => {
    const SELECT_ALL_TOURCITY = 'SELECT * FROM city_points';
    Connection.query(SELECT_ALL_TOURCITY, (err, cities) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                data: cities
            })
        }
    });
});

app.get('/cityPoints/:id', (req, res) => {
    let cityPoint_id = req.params.id;
    if (!cityPoint_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid City Point id!"
        });
    }

    Connection.query('SELECT * FROM city_points where id=?', cityPoint_id, (err, results, fields) => {
        if (err) {
            throw err;
        }
        return res.send({
            error: false,
            data: results[0],
            message: 'Has get the specific City Point successfully!'
        });
    })
})

// create City Points
app.post('/cityPoint', (req, res) => {
    let { scenic_spot_code, scenic_spot_name, city_point_category, city_code, city_name } = req.body;
    if (!scenic_spot_code || !city_code) {
        return res.status(400).send({
            error: true,
            message: "Please provide City Point data!"
        })
    }
    const INSERT_TOURCITY = `INSERT INTO city_points SET ?`;
    Connection.query(INSERT_TOURCITY, {
        scenic_spot_code: scenic_spot_code,
        scenic_spot_name: scenic_spot_name,
        city_point_category: city_point_category,
        city_code: city_code,
        city_name: city_name
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New City Point has been created!"
        })
    })
});

// update City Points
app.put('/cityPoint/:id', (req, res) => {
    let { scenic_spot_code, scenic_spot_name, city_point_category, city_code, city_name } = req.body;
    let cityPoint_id = req.params.id;
    if (!scenic_spot_code || !city_code || !cityPoint_id) {
        return res.status(400).send({
            error: true,
            message: "Please provider related City Point data!"
        })
    }

    const UPDATE_TOURCITY = `UPDATE city_points SET ? WHERE id= ?`;
    Connection.query(UPDATE_TOURCITY, [{
        scenic_spot_code: scenic_spot_code,
        scenic_spot_name: scenic_spot_name,
        city_point_category: city_point_category,
        city_code: city_code,
        city_name: city_name
    }, cityPoint_id], (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "The City Point has been updated successfully!"
        })
    })
})

// delete City Points
app.delete('/cityPoint/:id', (req, res) => {
    let cityPoint_id = req.params.id;
    if (!cityPoint_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide the City Point you want to delete!"
        })
    }

    const DELETE_WEATHER = `DELETE FROM city_points WHERE id = ?`;
    Connection.query(DELETE_WEATHER, [cityPoint_id], (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "Delete the City Point successfully!"
        })
    })
})

/*
    API for City Points CRUD ends
*/





app.listen(4000, () => {
    console.log('Weather Server listening on port 4000');
});

module.exports = app;




