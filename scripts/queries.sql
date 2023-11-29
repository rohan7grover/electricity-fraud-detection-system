CREATE TABLE fraud (                                           
    consumer_number integer PRIMARY KEY,
    fraud_status boolean, 
    FOREIGN KEY (consumer_number) REFERENCES consumer(consumer_number)
);

ALTER TABLE consumer
    ADD COLUMN area_code integer,
    ADD COLUMN city_code integer;   

