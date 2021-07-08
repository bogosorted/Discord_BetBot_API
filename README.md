
# Bet Bot for Discord

Bot made to persistently store the score of a certain player and make transactions possible from that score.
## How to use
Use the following command to start the bot, but first add your discord api token and your preferences in the config.json file.

```bash
node .
```

## Usage
### admin-only
```python
# Adds the value (possibly being negative) for the mentioned user. admin only command
$addcoin <value> <@username>
```
### client commands
```python
# Returns a list of the 'top 5' richest server scores
$magnata
```
```python
# Show your current balance
$mywallet
```
```python
# Transfers an amount from your account to that of the mentioned user (cannot be negative)
$deposit <value> <@username>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
