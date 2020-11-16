# Running the app

To run the app install docker and then run following command:

`docker-compose -p test-app -f test/test.yml -f test/dev.yml up -d`

# Example call:

## Create movie

```
curl --location --request POST 'http://localhost:3000/movies' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Ankit is steing",
    "genre": "Action",
    "rating": 5,
    "explicit": false
}'
```

## Get all movies

```
curl --location --request GET 'http://localhost:3000/movies'
```
