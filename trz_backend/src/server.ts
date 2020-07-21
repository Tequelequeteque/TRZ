import server from './app';

const { PORT } = process.env;

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
