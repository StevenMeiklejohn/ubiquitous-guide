
set @GalleryProfileID = 5207;

insert into PermissionProfile (ProfileID, ActionID, TargetProfileID)
select @GalleryProfileID, 1, a.ProfileID from Users u
join Artists a on u.ID = a.UserID
left join PermissionProfile pp on pp.ProfileID = @GalleryProfileID and pp.TargetProfileID = a.ProfileID
where pp.ID is null
and u.Email in
('tem@hfa.com','tbr@hfa.com','nco@hfa.com','msh@hfa.com','fpe@hfa.com','dhy@hfa.com','ara@hfa.com')
;


update Profiles set ActivCanvasStatusID = 3
where ID in (
	select a.ProfileID
	from Artists a
	join Users u on a.UserID = u.ID
	where u.Email in
	('tem@hfa.com','tbr@hfa.com','nco@hfa.com','msh@hfa.com','fpe@hfa.com','dhy@hfa.com','ara@hfa.com')
);



update Artists set Private = 1
where UserID in (
	select ID
	from Users
	where Email in
	('cou@arn.hk','tle@arn.hk','mwr@arn.hk','hwh@arn.hk','hbu@arn.hk','jad@arn.hk','kdo@arn.hk','mda@arn.hk','mgo@arn.hk','dfi@arn.hk','poz@arn.hk')
);




select pp.ID from
	Users u
	join Artists a on u.ID = a.UserID
	join PermissionProfile pp on pp.TargetProfileID = a.ProfileID
	where u.Email in
	('ara@artretailnetwork.com','dhy@artretailnetwork.com','fpe@artretailnetwork.com','msh@ARTRETAILNETWORK.COM','nco@ARTRETAILNETWORK.COM','tem@artretailnetwork.com','tbr@artretailnetwork.com')