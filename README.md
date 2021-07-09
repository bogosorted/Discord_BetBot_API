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
![2](https://user-images.githubusercontent.com/48594379/124861758-8d0f4080-df8a-11eb-8682-58cf60600884.PNG)

### client commands
```python
# Returns a list of the 'top 5' richest server scores
$magnata
```
![Capturar](https://user-images.githubusercontent.com/48594379/124861549-3144b780-df8a-11eb-8334-7fe59557bdb5.PNG)
```python
# Show your current balance
$mywallet
```
![4](https://user-images.githubusercontent.com/48594379/124861994-fe4ef380-df8a-11eb-85a3-197457d4e2d8.PNG)

```python
# Transfers an amount from your account to that of the mentioned user (cannot be negative)
$deposit <value> <@username>
```
![3](https://user-images.githubusercontent.com/48594379/124861903-d2337280-df8a-11eb-84f0-2daa974352d5.PNG)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
