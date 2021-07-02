import re
import string
import sys

def read_subtitle(subtitle_file):
    # subtitle_file = '/Users/lingyun/EdinburghPGT/OBS/sample.srt'
    content = ""
    # sentences = []
    with open(subtitle_file, "r", encoding="utf-8") as f:
        for line in f:
            # str = line.split('\n')[0]
            content += line
    sentences = content.split('\n\n')
    # print(len(sentences))
    # print(sentences)
    return sentences


def get_time_content(sentence):
    sentence = sentence.split('\n\n')
    # print(sentence)
    body = []
    prev_time = ""
    time = ""
    finalSentence = []
    for s in sentence:

        newSentence = []
        timeline = []
        # print(s)
        parts = s.split('\n')
        # print(parts)


        if len(parts) > 1:

            time = parts[1]
            # print(time)
            time_a = time.split('-->')[0].strip()
            time_b = time.split('-->')[1].strip()
            if parts[0] == "1":
                # print("a")
                timeline.append(time_a)
            else:
                timeline.append(prev_time)
            timeline.append(time_b)
            time = ' --> '.join(timeline)
            # print(time)
            prev_time = time_b
            # timeline.append()
            # print(change_time_b)
            # print(prev_time)
            # s_dic[sid].append(content)

        # print(timeline)

            newSentence.append(parts[0])
            del parts[0:2]
            body = "\n".join(parts)
    
            newSentence.append(time)
            newSentence.append(body)
            # print(newSentence)
            finalSentence.append( "\n".join(newSentence))
    # print(finalSentence)
    # finalSentence.append("\n")
    # print(len(finalSentence)
    finalSentence = "\n\n".join(finalSentence)
    # print(len(finalSentence))
    print(str(finalSentence))
    return finalSentence


# print(sys.argv[1])

content = sys.argv[1]
get_time_content(content)

# if __name__ == "__main__":

#     subtitle_file = "complex_math.srt"
#     filename = "new_complex_math.srt"
#     subtitle = read_subtitle(subtitle_file)
#     # print(subtitle)
#     # body, timeline = subtitle_process.get_time_content(subtitle)
#     new_subtitle = get_time_content(subtitle)

#     with open(filename,'w') as f:
#         for sentence in new_subtitle:
#             f.write(sentence)
#             f.write("\n\n")
