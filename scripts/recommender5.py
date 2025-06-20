import sys
import json
import numpy as np
import re
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction import DictVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.isri import ISRIStemmer
from nltk.tokenize import word_tokenize

# -----------------------
# 1. Arabic Preprocessing (Stemming)
# -----------------------
arabic_stopwords = set([
    'في', 'من', 'على', 'و', 'عن', 'إلى', 'ما', 'لا', 'لم', 'لن', 'هو', 'هي', 'أن', 'إن', 'كان', 'كانت',
    'هذا', 'هذه', 'ذلك', 'لكن', 'قد', 'كما', 'مع', 'أو', 'ثم', 'أي', 'أيضًا', 'بعد', 'قبل', 'بين'
])

stemmer = ISRIStemmer()

def preprocess_arabic(text):
    text = re.sub(r'[^\w\s]', '', text)  # إزالة الرموز 
    words = word_tokenize(text)
    filtered_stemmed = []
    for word in words:
        if word not in arabic_stopwords and word.isalpha():
            filtered_stemmed.append(stemmer.stem(word))
    return " ".join(filtered_stemmed)


# -----------------------
# 2. قراءة البيانات من stdin
# -----------------------
input_data = sys.stdin.read()
parsed = json.loads(input_data)

user_prefs = parsed.get("userPreferences")
attractions = parsed.get("attractions", [])
all_users = parsed.get("allUsers", [])  # المستخدمين الآخرين للتوصية التعاونية

if not attractions or not user_prefs:
    print(json.dumps([]))
    sys.exit(0)

# -----------------------
# 3. تشابه التفضيلات Content-Based
# -----------------------
vec = DictVectorizer(sparse=False)
vectorized = vec.fit_transform([user_prefs] + [a["preferences"] for a in attractions])
user_vec = vectorized[0:1]
attractions_vecs = vectorized[1:]
preferences_similarity = cosine_similarity(user_vec, attractions_vecs)[0]

# -----------------------
# 4. تشابه الوصف العربي TF-IDF
# -----------------------
top_n = 3
top_indices = np.argsort(preferences_similarity)[-top_n:][::-1]
top_descriptions = [preprocess_arabic(attractions[i].get("description", "")) for i in top_indices]
all_descriptions = [preprocess_arabic(a.get("description", "")) for a in attractions]
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(all_descriptions)
top_matrix = tfidf_vectorizer.transform(top_descriptions)
mean_top_vector = np.asarray(top_matrix.mean(axis=0))
description_similarity = cosine_similarity(tfidf_matrix, mean_top_vector)[::, 0]

# -----------------------
# 5. Collaborative Filtering (تشابه المستخدمين)
# -----------------------
def calc_user_similarity(user1, user2):
    all_keys = set(user1.keys()).union(set(user2.keys()))
    v1 = np.array([user1.get(k, 0) for k in all_keys])
    v2 = np.array([user2.get(k, 0) for k in all_keys])
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

# حساب التشابه مع المستخدمين الآخرين
collab_score = {}
for other_user in all_users:
    sim = calc_user_similarity(user_prefs, other_user.get("preferences", {}))
    for aid in other_user.get("likedAttractions", []):
        collab_score[aid] = collab_score.get(aid, 0) + sim

# -----------------------
# 6. دمج الدرجات
# -----------------------
weight_pref = 0.6
weight_desc = 0.2
weight_collab = 0.2

results = []
for i, attraction in enumerate(attractions):
    aid = attraction["_id"]
    combined_score = (
        weight_pref * preferences_similarity[i] +
        weight_desc * description_similarity[i] +
        weight_collab * collab_score.get(aid, 0)
    )
    results.append({
        "attractionId": aid,
        "score": round(float(combined_score), 4)
    })

results.sort(key=lambda x: x["score"], reverse=True)

# -----------------------
# 7. إخراج النتائج
# -----------------------
print(json.dumps(results))
