module.exports.run = async (bot, message, args) => {
    console.log('running add command');
    const { Client } = require('pg');

    const dbClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    var mins = Number(args[0]);
    if (Number.isInteger(mins)) {
        let sql;
        dbClient.connect()
        .then(() => console.log('connected to database'))
        .then(() => dbClient.query(`select * from userminutes where userid = '${message.author.id}'`))
        .then(results => {
            if (results.rows < 1) {
                sql = `insert into userminutes (userid, mins) values ('${message.author.id}', '${mins}')`;
            } else {
                mins = mins+results.rows[0].mins;
                sql = `update userminutes set mins = '${mins}' where userid = '${message.author.id}'`;
            }
        })
        .then(() => dbClient.query(sql))
        .then(() => message.channel.send('You have meditated for '+args[0]+' minutes. Your total meditation time is '+mins+' minutes.'))
        .catch(e => console.log(e))
        .finally(() => dbClient.end())
    } else {
        message.channel.send('Improper usage of !add. Try something like this: !add 5');
    }

/*     dbClient.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
    }) */

    //dbClient.end();
}