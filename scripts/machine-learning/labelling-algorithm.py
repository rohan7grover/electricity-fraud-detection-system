import pandas as pd
import numpy as np

data = pd.read_csv('Dataset/unlabelled data.csv')
delta = 2.0

consumer_numbers = data['consumer_number'].values
data = data.drop(columns=['consumer_number'])

score = np.zeros(len(data))
pos = np.arange(len(data))

for i in range(len(data)):
    mu_h = data.iloc[i].mean()
    sigma_h = data.iloc[i].std()
    zh_d = (data.iloc[i] - mu_h) / sigma_h
    label_h_d = zh_d < (-delta * sigma_h)
    day_level_score = np.sum(label_h_d)
    score[i] = day_level_score

pos = np.argsort(score)

result_df = pd.DataFrame({'ConsumerNumber': consumer_numbers, 'Rank': pos})
result_df = result_df.sort_values(by='Rank', ascending=True)

size = int(np.round(0.1 * result_df.shape[0]))
defaulter_list = result_df.head(size)['ConsumerNumber'].tolist()

data = pd.read_csv('Dataset/unlabelled data.csv')
data['fraud_status'] = 0
data.loc[data['consumer_number'].isin(defaulter_list), 'fraud_status'] = 1
data[['consumer_number','fraud_status']].to_csv('Dataset/labelled data.csv',index=False)
