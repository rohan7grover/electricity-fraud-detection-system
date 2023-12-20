CREATE TABLE fraud (                                           
    consumer_number integer PRIMARY KEY,
    fraud_status boolean, 
    FOREIGN KEY (consumer_number) REFERENCES consumer(consumer_number)
);

ALTER TABLE consumer
    ADD COLUMN area_code integer,
    ADD COLUMN city_code integer;   

-- TABLE AREA

-- public.area definition

-- Drop table

-- DROP TABLE public.area;

CREATE TABLE public.area (
	area_code int4 NOT NULL,
	city_code int4 NOT NULL,
	area_name varchar(255) NOT NULL,
	tier2_officer int4 NOT NULL,
	CONSTRAINT area_pkey PRIMARY KEY (area_code, city_code),
	CONSTRAINT area_tier2_officer_key UNIQUE (tier2_officer)
);

-- Table Triggers

create trigger check_tier2_user before
insert
    or
update
    on
    public.area for each row execute function tier2_user_check();


-- public.area foreign keys

ALTER TABLE public.area ADD CONSTRAINT area_city_code_fkey FOREIGN KEY (city_code) REFERENCES public.city(city_code);
ALTER TABLE public.area ADD CONSTRAINT area_tier2_officer_fkey FOREIGN KEY (tier2_officer) REFERENCES public.app_useraccount(id);


-- TABLE CITY

-- public.city definition

-- Drop table

-- DROP TABLE public.city;

CREATE TABLE public.city (
	city_code int4 NOT NULL,
	city_name varchar(255) NOT NULL,
	tier1_officer int4 NOT NULL,
	CONSTRAINT city_city_name_key UNIQUE (city_name),
	CONSTRAINT city_pkey PRIMARY KEY (city_code),
	CONSTRAINT city_tier1_officer_key UNIQUE (tier1_officer)
);

-- Table Triggers

create trigger check_tier1_user before
insert
    or
update
    on
    public.city for each row execute function tier1_user_check();


-- public.city foreign keys

ALTER TABLE public.city ADD CONSTRAINT city_tier1_officer_fkey FOREIGN KEY (tier1_officer) REFERENCES public.app_useraccount(id);


-- TABLE CONSUMERS

-- public.consumer definition

-- Drop table

-- DROP TABLE public.consumer;

CREATE TABLE public.consumer (
	consumer_number int4 NOT NULL,
	area_code int4 NULL,
	city_code int4 NULL,
	CONSTRAINT consumer_pkey PRIMARY KEY (consumer_number)
);


-- public.consumer foreign keys

ALTER TABLE public.consumer ADD CONSTRAINT fk_consumer_area FOREIGN KEY (area_code,city_code) REFERENCES public.area(area_code,city_code);



-- TABLE CONSUMPTION HISTORY

-- public.consumption_history definition

-- Drop table

-- DROP TABLE public.consumption_history;

CREATE TABLE public.consumption_history (
	consumer_number int4 NOT NULL,
	"time" timestamp NOT NULL,
	consumption float8 NOT NULL,
	CONSTRAINT consumption_history_pkey PRIMARY KEY (consumer_number, "time")
);


-- public.consumption_history foreign keys

ALTER TABLE public.consumption_history ADD CONSTRAINT FOREIGN KEY (consumer_number) REFERENCES public.consumer(consumer_number);


-- TABLE FRAUD

-- public.fraud definition

-- Drop table

-- DROP TABLE public.fraud;

CREATE TABLE public.fraud (
	consumer_number int4 NOT NULL,
	fraud_status bool NULL,
	CONSTRAINT fraud_pkey PRIMARY KEY (consumer_number)
);


-- public.fraud foreign keys

ALTER TABLE public.fraud ADD CONSTRAINT fraud_consumer_number_fkey FOREIGN KEY (consumer_number) REFERENCES public.consumer(consumer_number);


TABLE TIER2_TIER3_RELATIONSHIP

-- public.tier2_tier3_relationship definition

-- Drop table

-- DROP TABLE public.tier2_tier3_relationship;

CREATE TABLE public.tier2_tier3_relationship (
	tier3_officer int4 NOT NULL,
	tier2_officer int4 NOT NULL,
	CONSTRAINT tier2_tier3_relationship_pkey PRIMARY KEY (tier3_officer)
);

-- Table Triggers

create trigger check_tier3_user before
insert
    or
update
    on
    public.tier2_tier3_relationship for each row execute function tier3_user_check();


-- public.tier2_tier3_relationship foreign keys

ALTER TABLE public.tier2_tier3_relationship ADD CONSTRAINT tier2_tier3_relationship_tier2_officer_fkey FOREIGN KEY (tier2_officer) REFERENCES public.area(tier2_officer);
ALTER TABLE public.tier2_tier3_relationship ADD CONSTRAINT tier2_tier3_relationship_tier3_officer_fkey FOREIGN KEY (tier3_officer) REFERENCES public.app_useraccount(id);


-- FUNCTION TIER1

CREATE OR REPLACE FUNCTION public.tier1_user_check()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.tier1_officer IS NOT NULL THEN
        IF (SELECT role FROM app_useraccount WHERE id = NEW.tier1_officer) <> 'tier1' THEN
            RAISE EXCEPTION 'The selected user must have a role of ''tier1''.';
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;


-- FUNCTION TIER2

CREATE OR REPLACE FUNCTION public.tier2_user_check()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.tier2_officer IS NOT NULL THEN
        IF (SELECT role FROM app_useraccount WHERE id = NEW.tier2_officer) <> 'tier2' THEN
            RAISE EXCEPTION 'The selected user must have a role of ''tier2''.';
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;

-- FUNCTION TIER3

CREATE OR REPLACE FUNCTION public.tier3_user_check()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.tier3_officer IS NOT NULL THEN
        IF (SELECT role FROM app_useraccount WHERE id = NEW.tier3_officer) <> 'tier3' THEN
            RAISE EXCEPTION 'The selected user must have a role of ''tier3''.';
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;


CREATE TABLE raid_status (
    tier3_officer INT REFERENCES tier2_tier3_relationship(tier3_officer),
    consumer_number INT,
    comment TEXT,
    raid_status VARCHAR(10) DEFAULT 'pending' CHECK (raid_status IN ('pending', 'completed')),
    is_defaulter VARCHAR(3) CHECK (is_defaulter IN ('yes', 'no')),
    image_id VARCHAR,
    raid_date TIMESTAMP,
    PRIMARY KEY (tier3_officer, consumer_number)
);