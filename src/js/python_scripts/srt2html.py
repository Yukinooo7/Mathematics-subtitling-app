from jinja2 import Environment, FileSystemLoader
import normal_math
import sys
import os


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


# f = open(sys.argv, 'r')
# print(f)
subtitle_file = sys.argv[1]
htmlfile = sys.argv[2]
# print(sys.argv[0])
# print(sys.argv[1])
# print(sys.argv[2])


subtitle = normal_math.read_subtitle(subtitle_file)
# print(subtitle)
# body, timeline = subtitle_process.get_time_content(subtitle)
body, timeline = normal_math.get_time_content(subtitle)

generate_html(body, timeline, htmlfile)