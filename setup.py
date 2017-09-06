# -*- coding: utf-8 -*-
from setuptools import setup, find_packages


setup(
    name='reverse-ssh-manager',
    version='1.2',
    description='reverse-ssh-manager allows to manage reverse ssh connections '
                'through a web application',
    long_description=open('README.rst').read(),
    license='MIT',
    author='Bruno Binet',
    author_email='bruno.binet@gmail.com',
    keywords=['ssh', 'tunnel', 'reverse', 'manage', 'web', 'application'],
    url='https://github.com/bbinet/reverse-ssh-manager',
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        'License :: OSI Approved :: MIT License',
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: POSIX :: Linux",
        "Operating System :: Unix",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.6",
        "Programming Language :: Python :: 2.7",
        ],
    entry_points={
        'console_scripts': ['reverse-ssh-manager=rsm.server:run']
        },
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'bottle',
        'psutil',
    ],
)
