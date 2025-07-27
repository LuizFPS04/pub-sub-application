import app from './app'

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send(`Football API is running...`);
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})