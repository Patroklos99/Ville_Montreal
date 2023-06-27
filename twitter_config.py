import tweepy

consumer_key = 'HAeEhNt23Y7mwcAI6Eb1ijQCx'
consumer_secret = 'cvn4p3dAZdJRPvX4YbXI9KNEJJ54U8P2nMGrH56KwxIOUCSe8n'
access_token = '1673767219526770839-4s5zLkbhoMUw9OVxf45suPSnCN0JOF'
access_token_secret = 'JuwR5w5HvBmiWFO9a6iADB4WtJozimldZ1uLK4BT9xFnW'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api_twitter = tweepy.API(auth)