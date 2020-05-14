const express = require('express'), path = require('path'), fileUpload = require('express-fileupload'), busboy = require('connect-busboy');
const url = require('url');
const querystring = require('querystring');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const blobUtil = require('blob-util');
const Blob = require("cross-blob");
const FileReader = require('filereader')
const fs = require('fs');
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
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(busboy());



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



/*
    API for Travel Notes CRUD begins
*/

// get Travel Notes
app.get('/travelNotes', (req, res) => {
    const SELECT_ALL_TRAVNOTES = 'SELECT * FROM travel_notes';
    Connection.query(SELECT_ALL_TRAVNOTES, (err, notes) => {
        if (err) {
            return res.send(err);
        } else {

            // res.json will response json format data, and can not process binary
            return res.json({
                data: notes
            })
        }
    });
});

app.get("/travalNodesImg/:id", (req, res) => {
    let travelNotes_id = req.params.id;
    if (!travelNotes_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid Travel Note id!"
        });
    }

    Connection.query('SELECT * FROM travel_notes where id=?', travelNotes_id, (err, results, fields) => {
        if (err) {
            throw err;
        }
        return res.end(results[0].image, "binary");
    })
})

app.get("/imgtest", (req, res) => {
    const SELECT_ALL_TRAVNOTES = 'SELECT * FROM travel_notes';
    Connection.query(SELECT_ALL_TRAVNOTES, (err, notes) => {
        if (err) {
            return res.send(err);
        } else {
            return res.end(notes[1].image, "binary")
        }
    });
})

app.get('/travelNotes/:id', (req, res) => {
    let travelNotes_id = req.params.id;
    if (!travelNotes_id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid Travel Note id!"
        });
    }

    Connection.query('SELECT * FROM travel_notes where id=?', travelNotes_id, (err, results, fields) => {
        if (err) {
            throw err;
        }
        return res.send({
            error: false,
            data: results[0],
            message: 'Has get the specific Travel Note successfully!'
        });
    })
})

// create Travel Notes
app.post('/travelNote', (req, res) => {
    let { title, description, destination, image } = req.body;
    if (!title) {
        return res.status(400).send({
            error: true,
            message: "Please provide Travel Note data!"
        })
    }
    const INSERT_TRAVNOTE = `INSERT INTO travel_notes SET ?`;
    Connection.query(INSERT_TRAVNOTE, {
        title: title,
        description: description,
        destination: destination,
        image: image
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New Travel Note has been created!"
        })
    })
});


// update Travel Notes
app.put('/travelNote/:id', (req, res) => {
    let { title, description, destination, image } = req.body;
    let travelNotes_id = req.params.id;

    let files = req.files;
    // let file = files.fileUpload;
    // return res.send(files.name);
    if (!files) {
        return res.send({
            fileUpload: files,
            name: files.uploadfile.name,
            reqBody: req.body,
            message: "ensure the upload file"
        })
    }

    // if (!title) {
    //     return res.status(400).send({
    //         error: true,
    //         message: "Please provider related Travel Note data!"
    //     })
    // }


    files.uploadfile.mv('C:\Users\I323799\weather-server' + files.uploadfile.name, function (err) {

        if (err)
            return res.status(500).send(err);

        // let sql = "INSERT INTO `users_image`(`first_name`,`last_name`,`mob_no`,`user_name`, `password` ,`image`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "','" + img_name + "')";

        // let query = db.query(sql, function (err, result) {
        //     res.redirect('profile/' + result.insertId);
        // });

        const UPDATE_TRAVNOTE = `UPDATE travel_notes SET ? WHERE id= ?`;
        Connection.query(UPDATE_TRAVNOTE, [{
            // title: title,
            // description: description,
            // destination: destination,
            image: files.uploadfile.name
        }, travelNotes_id], (error, results, fields) => {
            if (error) {
                throw error;
            }
            return res.send({
                error: false,
                data: results,
                message: "The Travel Note has been updated successfully!"
            })
        })
    });


})

// delete Travel Notes
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
    API for Travel Note Content CRUD begins
*/
// get cotents according to the current travel note
app.get('/travelNote', (req, res) => {
    // const noteID = req.query.noteID;

    const SELECT_ALL_NOTECONTENT = 'SELECT * FROM travel_note';
    Connection.query(SELECT_ALL_NOTECONTENT, (err, contents) => {
        if (err) {
            return res.send(err);
        } else {

            // res.json will response json format data, and can not process binary
            return res.json({
                data: contents
            })
        }
    });
});



// get the specific resources from above api
// implementation by CKEditor5
app.get("/travelNote/:id", (req, res) => {
    // let parsedUrl = url.parse(rawUrl);
    // let parsedQs = querystring.parse(parsedUrl.query);
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid Travel Note Content id!"
        });
    }

    Connection.query('SELECT * FROM travel_note where id=?', id, (err, results, fields) => {
        if (err) {
            throw err;
        }

        if (results) {
            // console.log(res.write(results[0].content));
            return res.end(results[0].content, "binary");
        }
    })
})


app.post("/noteContent", (req, res) => {
    // get full html from frontend
    // store it to database

    let {content} = req.body;
    const INSERT_TRAVELNOTE = `INSERT INTO travel_note SET ?`;
    Connection.query(INSERT_TRAVELNOTE, {
        content: content
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New Travel Note has been created!"
        })
    })
})


app.get("/resources/:id", (req, res) => {
    // get html from databse
    // return it to frontend

    let id = req.params.id;

    if (!id) {
        return res.status(400).send({
            error: true,
            message: "Please provide valid Resources id!"
        });
    }

    Connection.query('SELECT * FROM resources where id=?', id, (err, results, fields) => {
        if (err) {
            throw err;
        }

        if (results) {
            // console.log(res.write(results[0].content));
            return res.end(
                Buffer.from(results[0].content.toString("UTF-8"),"base64")
            );
            // return res.end(results[0].content, "binary");
        }
    })
})


app.post("/resource", (req, res) => {
    // get content type & blob from request header


    let { content, type } = req.body;
    const INSERT_RESOURCES = `INSERT INTO resources SET ?`;
    Connection.query(INSERT_RESOURCES, {
        content: content,
        type: type
    }, (error, results, fields) => {
        if (error) {
            throw error;
        }
        return res.send({
            error: false,
            data: results,
            message: "New Resource has been created!"
        })
    })





    // store them to resource table
    // return the new created resource id
    // then, frontend use the resource id to reference the resource
})


/*
    API for Travel Note Content CRUD ends
*/





app.listen(4000, () => {
    console.log('Weather Server listening on port 4000');
});

module.exports = app;




