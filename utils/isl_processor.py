import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')

# Standard stopwords
stop_words = set(stopwords.words('english'))

# Words to remove explicitly
extra_remove = {"am", "is", "are", "was", "were", "be", "been", "being",
                "a", "an", "the", "to"}

lemmatizer = WordNetLemmatizer()

def convert_to_isl(text):
    text = text.lower()
    words = word_tokenize(text)
    tagged = pos_tag(words)

    subject = []
    verb = []
    object_words = []

    for word, tag in tagged:
        if word.isalpha() and word not in extra_remove:
            # Pronouns → Subject
            if tag in ("PRP", "PRP$"):
                subject.append(word.upper())
            # Verbs → Verb
            elif tag.startswith("VB"):
                root_word = lemmatizer.lemmatize(word, pos='v')
                verb.append(root_word.upper())
            # Nouns/adjectives → Object
            elif tag.startswith("NN") or tag.startswith("JJ"):
                object_words.append(word.upper())

    # ISL Order: Verb + Subject + Object
    isl_sequence = verb + subject + object_words

    # Return a single string with spaces
    return " ".join(isl_sequence)