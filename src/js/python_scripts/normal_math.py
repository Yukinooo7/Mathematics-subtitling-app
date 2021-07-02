import re
import string


def read_subtitle(subtitle_file):
    # subtitle_file = '/Users/lingyun/EdinburghPGT/OBS/sample.srt'
    content = ""
    # sentences = []
    with open(subtitle_file, "r", encoding="utf-8") as f:
        for line in f:
            # str = line.split('\n')[0]
            content += line
    sentences = content.split('\n\n')
    return sentences


def get_time_content(sentence):
    s_dic = {}
    body = []
    timeline = []
    prev_time = 0
    for s in sentence:
        # print(s)
        parts = s.split('\n')
        # print(parts)
        if len(parts) > 1:
            sid = parts[0]
            s_dic[sid] = []

            time = parts[1]
            time_a = time.split('-->')[0].strip()
            time_b = time.split('-->')[1].strip()
            time_a = re.sub(r"[{}]+".format(':,'), ' ', time_a).split(' ')
            time_b = re.sub(r"[{}]+".format(':,'), ' ', time_b).split(' ')
            change_time_a = (int(time_a[1]) * 60 + int(time_a[2])) * 1000 + int(time_a[3])
            change_time_b = (int(time_b[1]) * 60 + int(time_b[2])) * 1000 + int(time_b[3])
            if prev_time == "":

                timeline.append(change_time_a)
                    # print("Start time1: "+str(change_time_a))
            else:
                    # print(prev_time)

                timeline.append(0)
                    # print("Start time2: "+str(change_time_a-prev_time))
            change_time = change_time_b - prev_time
                # print("End time: "+str(change_time))
                # s_dic[sid].append(change_time)
            timeline.append(change_time)
                # body.append(content)
            prev_time = change_time_b
            # print(change_time_b)
            # print(prev_time)
            # s_dic[sid].append(content)

        del parts[0:2]
        body.append(parts)
        # del parts[0]
        # print(parts)
        # parts = normal2LaTeX(parts)
        # print(parts)
        # if len(parts) != 0:
        #     if parts[-1] != "":
        #         print(parts)
        #         subtitles = " <br> ".join(parts)
        #         print(subtitles)
        #     else:
        #         parts = normal2LaTeX(parts)
        # subtitles = " ".join(parts)
        #     # print(subtitles)
        # body.append(subtitles)
    body = normal2LaTeX(body)
    # print(body)
    # print(timeline)
    # print(len(timeline))
    return body, timeline


def normal2LaTeX(subtitles):

    hasSum = False
    sumList = ["", "\sum_{", "", "=", "", "}^{", "", "}", ""]
    # the sum from j equals 0 to k
    # \( \sum_{j = 0}^{k}
    latex_list = ["\\("]
    math_subtitle = []
    # print(len("'"))

    for lines in subtitles:
        start_list = []
        end_list = []
        latex = []
        line = " ".join(lines)
        # for line in lines:
            # print(line)
        latex_line = []
        line = line.replace("equals", "=")
        line = line.replace("equal", "=")
        line = line.replace("minus", "-")
        line = line.replace("negative", "-")
        line = line.replace('squared', "^{2}")
        line = line.replace("alpha", "\\alpha_")
        line = line.replace("Alpha", "\\alpha_")
        line = line.replace("beta", "\\beta_")
        line = line.replace("Beta", "\\beta_")
        line = line.replace("theta", "\\theta_")
        line = line.replace("Theta", "\\theta_")
        line = line.replace("rho", "\\rho")
        line = line.replace("Rho", "\\rho")
        line = line.replace("Sigma", "\\sigma")
        line = line.replace("sigma", "\\sigma")
        line = line.replace("plus", "+")
        line = line.replace("subscript", "_")
        line = line.replace("times", "*")
        line = line.replace("one", "1")
        line = line.replace("two", "2")
        line = line.replace("prime", "'")
        symbols = ["\\rho", "\\\sigma"]
        words = line.split(" ")
        punc = string.punctuation.replace("\\", "")
        previous = ""
        # if words.__contains__("sum"):
        #     hasSum = True
        for word in words:
            # if word == "'":
            #     print(word)
            #     print(previous)
            if len(word) == 1:
                # latex_line.append("\\(")
                # print(word)
                if previous.__contains__("_"):
                    # print(previous)
                    # print(word)
                    if word == "_":
                        word = previous
                    else:
                        latex_list.append("{")
                        latex_list.append(word)
                        latex_list.append("}")
                elif previous == "'":
                #     continue
                    # print(previous)
                    # print(word)

                    latex_list.append("(")
                    latex_list.append(word)
                    latex_list.append(")")
                    # print(latex_list)
                else:
                    latex_list.append(word)
                # latex_line.append(word)
                # latex_line.append("\\)")

                # previous = word
                # print(previous)

                # print("\n")
            elif word.__contains__("_"):
                # print(word)
                latex_list.append(word)
                # print(latex_list)
            # delete punctuation at the end of the sentence, e.g. n. -> n
            elif len(word) == 2:
                out = ''.join(ch for ch in word if ch not in punc)
                # print(out)
                if previous == "'":
                    # print(out)
                    word = previous

                    continue
                elif len(out) == 1:
                    # print(out)
                    latex_list.append(word)
                else:
                    if len(latex_list) > 1:
                        latex_list.append("\\)")
                        latex_list.append(word)

                        latex_line.extend(latex_list)
                        latex_list = ["\\("]
                    else:
                        latex_line.append(word)
                # print(word)
                # print(latex_line)
            elif ''.join(ch for ch in word if ch not in punc) in symbols:
                # A bug what no idea how to fix it
                if word == "\\\sigma":
                    word = "\\sigma"
                latex_list.append(word)
                # print(word)
            else:
                # if latex_line.__contains__("\\(") and not ("\\)") in latex_line:
                #     latex_line.append("\\)")
                if len(latex_list) > 1:
                    latex_list.append("\\)")
                    latex_list.append(word)

                    latex_line.extend(latex_list)
                    latex_list = ["\\("]
                else:
                    latex_line.append(word)
            previous = word
            # if word == "'":
            #     print(len(word))
            # if len(previous) == 1:
                # print(previous)
                # print(latex_line)

        if len(latex_list) > 1 and not "\\)" in latex_list:
            latex_list.append("\\)")
            latex_line.extend(latex_list)
            latex_list = ["\\("]

        # print(latex_line)
        # print(len(latex_line))
        # latex.append(" ".join(latex_line))
        valid_length =  len(list(filter(str.isalnum, latex_line)))
        # print(valid_length)
        if valid_length > 6:
            position = 5
            if latex_line.__contains__("\\)"):
                position = latex_line.index("\\)")
            latex_line.insert(position+1, "<br>")
        # print(latex_line)
        # latex = " ".join(latex)
        # print(latex)
        # print(len(latex)) 
        math_subtitle.append(" ".join(latex_line))
    # print(math_subtitle)
    return math_subtitle


# sentence = read_subtitle('complex_math.srt')
# body, timeline = get_time_content(sentence)
# print(body)
# print(len(body))
# print(len(timeline))
# print(timeline)
# print(len(sentences)-1)
# print(sentences[str(len(sentences)-1)][0])
