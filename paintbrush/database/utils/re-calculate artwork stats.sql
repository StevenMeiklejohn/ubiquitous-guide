use paintbrush_production;


UPDATE Artworks SET Views = COALESCE((	SELECT count(id)    FROM AnalyticEvents     WHERE AnalyticEvents.EventID = 7 AND AnalyticEvents.ArtworkID = Artworks.ID     GROUP BY AnalyticEvents.ArtworkID ), 0);


UPDATE Artworks SET Scanned = COALESCE((	SELECT count(id)    FROM AnalyticEvents     WHERE AnalyticEvents.EventID = 2 AND AnalyticEvents.ArtworkID = Artworks.ID     GROUP BY AnalyticEvents.ArtworkID ), 0);


