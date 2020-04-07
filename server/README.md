## Settings

| ENV variable        | Default value                   | Description                                   |
| ------------------- | ------------------------------- | --------------------------------------------- |
| AUTH_DURATION       | P1D                             | Duration of login as ISO 8601 duration string |
| AUTH_SECRET         | secret                          | Key to sign JWT tokens CHANGE THIS!           |
| BASE_DIR            | /api                            | Base URL of the server                        |
| DATABASE_URI        | mongodb://localhost:27017/bosan | Database path and credentials                 |
| FACEBOOK_APP_ID     |                                 | Facebook APP ID for sharing                   |
| GOOGLE_APP_ID       |                                 | Google APP ID for login, mailing and sharing  |
| GOOGLE_CLIENT_ID    |                                 | Google Client ID for mailing                  |
| GOOGLE_IMPERSONATE  |                                 | Which account to use for mailing              |
| GOOGLE_PRIVATE_KEY  |                                 | Google Private key for mailing                |
| GOOGLE_SERVICE_MAIL |                                 | Google service account ID for mailing         |
| ICAL_DOMAIN         | SEVRER_HOST                     | Domain to use for iCal exports                |
| ICAL_ORGANIZER      | SITE_TITLE \<SITE_MAIL>         | Organizer mail to user for iCal exports       |
| SERVER_HOST         | 0.0.0.0                         | Server host                                   |
| SERVER_PORT         | 3000                            | Server port                                   |
| SITE_CONTACT        |                                 | Site contact                                  |
| SITE_DESCRIPTION    |                                 | Site description                              |
| SITE_MAIL           | Šán                             | Site title                                    |
| SITE_URL            | http://SERVER_HOST:SERVER_PORT  | Site url                                      |
| STORAGE             | /data                           | Root storage directory                        |
| STORAGE_CONFIG      | STORAGE + /config               | Storage directory for config                  |
| STORAGE_EVENTS      | STORAGE + /events               | Storage directory for events                  |
| STORAGE_PHOTOS      | STORAGE + /photos               | Storage directory for photos                  |
| STORAGE_THUMBS      | STORAGE + /thumbs               | Storage directory for thumbs                  |
| STORAGE_UPLOADS     | STORAGE + /uploads              | Storage directory for uploads                 |
| UPLOADS_LIMIT       | 10mb                            | Maximum size of an uploaded file              |