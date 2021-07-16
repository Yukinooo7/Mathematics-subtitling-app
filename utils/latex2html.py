import sys
import string
import os
import re

from jinja2 import Environment, FileSystemLoader

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

        # if parts.__contains__("["):
        #     print(parts)
        # else:
        body.append("".join(parts))
        # print("".join(parts))
    return body, timeline

def generate_html(body, timeline, savePath):
    # print(timeline)
    # print(body)
    # env = Environment(loader=FileSystemLoader('.'))
    env = Environment(
            loader=FileSystemLoader(
                os.path.abspath(
                    os.path.dirname(__file__))))

    template = env.get_template('template.html')

    with open(savePath, "w+") as fout:
        html_content = template.render(body = body, timeline= timeline)
        # print(html_content)
        fout.write(html_content)


body, timeline = get_time_content(sys.argv[1].split('\n\n'))

htmlfile = sys.argv[2]
# print(body)
generate_html(body, timeline, htmlfile)
# print(body)