ALTER TABLE [dbo].[Personnes] DROP CONSTRAINT [FK_Personnes_Groupes_Groupeid];
DROP INDEX [IX_Personnes_Groupeid] ON [dbo].[Personnes];

ALTER TABLE [dbo].[Personnes] DROP COLUMN [Groupeid];

ALTER TABLE [dbo].[Personnes] 
ADD CONSTRAINT [FK_Personnes_Groupes] FOREIGN KEY ([groupe_id]) REFERENCES [dbo].[Groupes] ([id]);

CREATE NONCLUSTERED INDEX [IX_Personnes_Groupeid]
ON [dbo].[Personnes]([groupe_id] ASC);
