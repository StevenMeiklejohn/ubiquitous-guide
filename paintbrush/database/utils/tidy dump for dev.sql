

update Users set Password = '$2a$10$PnLaw/l.QKKFKKjU/a9WguxyZiJpAX5W0VseOE.pVLxV35LfRn2OW';


UPDATE Users SET Email = CONCAT('dev-', Email)
WHERE Email not like 'dev-%' and Email not like 'kris%';
delete from ActivCanvasQueue;update VuforiaTargets set SyncRequired = 0;

