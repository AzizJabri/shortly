const server = require('./server');
const { PORT } = require('./src/configs');
const {connect} = require('./src/db');

const start = async () => {
    try {
        await connect();
        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();