--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE "change_log" (
    id SERIAL PRIMARY KEY,
    change_type VARCHAR(10) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    row_id INTEGER NOT NULL,
    StudyInstanceUID VARCHAR , 
    proccessed BOOLEAN NOT NULL,
    last_update DATE DEFAULT (datetime('now','localtime'))
    );

CREATE TABLE "image" ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    referenceId INTEGER, 
    InstanceNumber TEXT , 
    SOPInstanceUID TEXT UNIQUE, 
    SliceLocation TEXT , 
    ImageType TEXT , 
    NumberOfFrames TEXT , 
    Rows TEXT , 
    Columns TEXT , 
    WindowWidth TEXT , 
    WindowCenter TEXT , 
    PhotometricInterpretation TEXT , 
    RescaleSlope TEXT , 
    RescaleIntercept TEXT , 
    SamplesPerPixel TEXT , 
    PixelSpacing TEXT , 
    BitsAllocated TEXT ,
    BitsStored TEXT , 
    HighBit TEXT , 
    PixelRepresentation TEXT , 
    ImagePositionPatient TEXT , 
    ImageOrientationPatient TEXT , 
    SOPClassUID TEXT , 
    PrivateCreator TEXT ,  
    PlaceHoler TEXT 
    );

CREATE TABLE "patient" ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    referenceId INTEGER, 
    PatientBirthDate TEXT , 
    PatientSex TEXT , 
    PatientName TEXT , 
    PatientID TEXT , 
    PatientBirthTime TEXT , 
    RETIRED_OtherPatientIDs TEXT , 
    OtherPatientNames TEXT , 
    EthnicGroup TEXT , 
    PatientComments TEXT , 
    NumberOfPatientRelatedStudies TEXT , 
    NumberOfPatientRelatedSeries TEXT , 
    NumberOfPatientRelatedInstances TEXT ,  
    PlaceHoler TEXT 
    );

CREATE TABLE "series" ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    referenceId INTEGER, 
    SeriesNumber TEXT , 
    SeriesInstanceUID TEXT UNIQUE, 
    Modality TEXT , 
    SeriesDescription TEXT , 
    SeriesDate TEXT , 
    SeriesTime TEXT , 
    BodyPartExamined TEXT , 
    PatientPosition TEXT , 
    ProtocolName TEXT , 
    NumberOfSeriesRelatedInstances TEXT ,  
    PlaceHoler TEXT 
    );

CREATE TABLE "study" ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    referenceId INTEGER, 
    SpecificCharacterSet TEXT , 
    StudyDate TEXT , 
    StudyTime TEXT , 
    StudyID TEXT , 
    AccessionNumber TEXT , 
    ReferringPhysicianName TEXT , 
    StudyDescription TEXT , 
    NameOfPhysiciansReadingStudy TEXT , 
    StudyInstanceUID TEXT UNIQUE, 
    RETIRED_OtherStudyNumbers TEXT , 
    AdmittingDiagnosesDescription TEXT , 
    PatientAge TEXT , PatientSize TEXT , 
    PatientWeight TEXT , 
    Occupation TEXT , 
    AdditionalPatientHistory TEXT , 
    NumberOfStudyRelatedSeries TEXT , 
    NumberOfStudyRelatedInstances TEXT , 
    ModalitiesInStudy TEXT ,  
    PlaceHoler TEXT 
);

CREATE INDEX imageIndex ON image(referenceId);
CREATE INDEX patientIndex ON patient(referenceId);
CREATE INDEX seriesIndex ON series(referenceId);
CREATE INDEX studyIndex ON study(referenceId);


CREATE TRIGGER syncDB AFTER INSERT on study 
FOR EACH ROW 
BEGIN
  INSERT INTO change_log (change_type, table_name, row_id, StudyInstanceUID, proccessed)
  VALUES ('INSERT', 'study', New.referenceId,NEW.StudyInstanceUID, false);
END;

CREATE TRIGGER sync_DB AFTER INSERT on series 
BEGIN
  UPDATE change_log SET proccessed = false WHERE row_id = New.referenceId;
END;


--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE "study";
DROP TABLE "series";
DROP TABLE "image";
DROP TABLE "patient";
DROP TABLE "sqlite_sequence";
DROP TABLE "change_log";


