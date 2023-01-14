docker run --rm --volumes-from pg01 -v $(pwd):/backup ubuntu tar czvf /backup/backup.tar.gz /var/lib/postgresql/data
