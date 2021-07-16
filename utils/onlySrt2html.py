import sys
import string
import os

# print("aaa")
# print(sys.argv)
# print(len(sys.argv))
# print(sys.argv[0])


def singleSubtitleProcess(line):
    latex_list = ["\\("]
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
        if len(word) == 1 and word != 'I':
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
                #     print(previous)
                #     print(word)

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
    if len(latex_list) > 1 and not "\\)" in latex_list:
        latex_list.append("\\)")
        latex_line.extend(latex_list)
        latex_list = ["\\("]

    return " ".join(latex_line)
# for item in sys.argv[1]:
#     print(item)


subtitle = sys.argv[1].split("\n")
# print(subtitle)

for item in subtitle:
    item = singleSubtitleProcess(item)
    print(item)
# print(subtitle)
# print(len(subtitle.split("\n")))
# print(subtitle.split(","))

# print(singleSubtitleProcess(subtitle))