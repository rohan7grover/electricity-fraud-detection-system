import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load the dataset
final_data_short = pd.read_csv('final_data_short_sample.csv')
data_labels = pd.read_csv('labelled data.csv')

# Preprocess the dataset
final_data_short.fillna(0, inplace=True)  # Fill missing values

# Ensure indices align properly
final_data_short.set_index('consumer_number', inplace=True)
data_labels.set_index('consumer_number', inplace=True)

# Extract the features for the labeled data
X_labeled = final_data_short.loc[data_labels.index]

# Normalize the features
scaler = StandardScaler()
X_labeled_normalized = scaler.fit_transform(X_labeled)

# Reshape input for RNN: [samples, time steps, features]
# Assuming each row is a separate time step
X_labeled_normalized = X_labeled_normalized.reshape((X_labeled_normalized.shape[0], 1, X_labeled_normalized.shape[1]))

y_labeled = data_labels['fraud_status']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_labeled_normalized, y_labeled, test_size=0.2, random_state=42)

# Build a simpler RNN model
model = Sequential()
model.add(SimpleRNN(20, activation='relu', input_shape=(1, X_train.shape[2])))
model.add(Dense(1, activation='sigmoid'))

# Compile the model
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=5, batch_size=16)

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print(f'Loss: {loss}, Accuracy: {accuracy}')
