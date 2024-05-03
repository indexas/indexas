import os
from setuptools import setup, find_packages

setup(
  name='indexnetwork-sdk',
  version='0.0.4',
  description='Index Network SDK',
  long_description=open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'README.MD')).read(),
  long_description_content_type='text/markdown',
  author='Index',
  author_email='accounts@index.network',
  url='https://github.com/indexnetwork/index',
  packages=find_packages(),
  include_package_data=True,
  package_data={
      "indexnetwork_sdk": ["bin/session.bin"],
  },
  install_requires=[
    'abnf',
    'aiohttp',
    'aiosignal',
    'annotated-types',
    'asn1crypto',
    'async-timeout',
    'attrs',
    'bip-utils',
    'bitarray',
    'cbor2',
    'certifi',
    'cffi',
    'charset-normalizer',
    'ckzg',
    'coincurve',
    'crcmod',
    'crypto',
    'cytoolz',
    'ecdsa',
    'ed25519-blake2b',
    'eth-account',
    'eth-hash',
    'eth-keyfile',
    'eth-keys',
    'eth-rlp',
    'eth-typing',
    'eth-utils',
    'eth_abi',
    'frozenlist',
    'hexbytes',
    'idna',
    'jsonschema',
    'jsonschema-specifications',
    'lru-dict',
    'multidict',
    'Naked',
    'parsimonious',
    'protobuf',
    'py-sr25519-bindings',
    'py_crypto_hd_wallet',
    'pycparser',
    'pycryptodome',
    'pydantic',
    'pydantic_core',
    'PyNaCl',
    'python-dateutil',
    'pyunormalize',
    'PyYAML',
    'referencing',
    'regex',
    'requests',
    'rlp',
    'rpds-py',
    'shellescape',
    'siwe',
    'six',
    'toolz',
    'typing_extensions',
    'urllib3',
    'web3',
    'websockets',
    'wheel',
    'yarl',
  ],
  python_requires='>=3.0',
)
