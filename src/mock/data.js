export const mockProducts = [
  {
    id: 'prod_1',
    name: '精选新鲜草莓礼盒',
    description: '产地直供，新鲜采摘，香甜可口',
    originalPrice: 99.9,
    groupPrice: 59.9,
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20strawberry%20gift%20box%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20strawberries%20close%20up%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=strawberry%20packaging%20box%20product%20photo&image_size=square_hd'
    ],
    groupSize: 3,
    groupDuration: 24,
    sales: 1256,
    stock: 100,
    rules: [
      '3人即可成团',
      '拼团有效期24小时',
      '不成团自动退款',
      '每人限购2份'
    ]
  },
  {
    id: 'prod_2',
    name: '进口车厘子JJ级',
    description: '智利进口，果肉饱满，甜度高',
    originalPrice: 199.9,
    groupPrice: 129.9,
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=imported%20cherries%20JJ%20grade%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherries%20in%20bowl%20close%20up%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20packaging%20product%20photo&image_size=square_hd'
    ],
    groupSize: 5,
    groupDuration: 48,
    sales: 892,
    stock: 50,
    rules: [
      '5人即可成团',
      '拼团有效期48小时',
      '不成团自动退款',
      '每人限购1份'
    ]
  },
  {
    id: 'prod_3',
    name: '有机蔬菜套餐',
    description: '绿色有机，新鲜健康，营养丰富',
    originalPrice: 128.0,
    groupPrice: 79.9,
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20vegetable%20package%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20vegetables%20assortment%20product%20photo&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vegetable%20delivery%20box%20product%20photo&image_size=square_hd'
    ],
    groupSize: 4,
    groupDuration: 24,
    sales: 2341,
    stock: 200,
    rules: [
      '4人即可成团',
      '拼团有效期24小时',
      '不成团自动退款',
      '每人限购3份'
    ]
  }
]

export const mockGroups = [
  {
    id: 'group_1',
    productId: 'prod_1',
    product: mockProducts[0],
    groupSize: 3,
    currentSize: 2,
    remainingSlots: 1,
    status: 'ongoing',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: 'user_2',
        name: '小明',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20man%20avatar%20portrait&image_size=square'
      },
      {
        id: 'user_3',
        name: '小红',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20woman%20avatar%20portrait&image_size=square'
      }
    ],
    isCreator: false
  },
  {
    id: 'group_2',
    productId: 'prod_2',
    product: mockProducts[1],
    groupSize: 5,
    currentSize: 3,
    remainingSlots: 2,
    status: 'ongoing',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: 'user_4',
        name: '李华',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20man%20avatar%20portrait&image_size=square'
      },
      {
        id: 'user_5',
        name: '张丽',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20woman%20avatar%20portrait&image_size=square'
      },
      {
        id: 'user_6',
        name: '王伟',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20professional%20man%20avatar%20portrait&image_size=square'
      }
    ],
    isCreator: false
  }
]

export const mockMyGroups = [
  {
    id: 'my_group_1',
    productId: 'prod_1',
    product: mockProducts[0],
    groupSize: 3,
    currentSize: 3,
    remainingSlots: 0,
    status: 'success',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    joinedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: 'user_1',
        name: '我',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
      },
      {
        id: 'user_7',
        name: '朋友A',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friend%20avatar%20portrait&image_size=square'
      },
      {
        id: 'user_8',
        name: '朋友B',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=another%20friend%20avatar%20portrait&image_size=square'
      }
    ],
    isCreator: true
  },
  {
    id: 'my_group_2',
    productId: 'prod_3',
    product: mockProducts[2],
    groupSize: 4,
    currentSize: 2,
    remainingSlots: 2,
    status: 'ongoing',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    joinedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: 'user_9',
        name: '团长',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=group%20leader%20avatar%20portrait&image_size=square'
      },
      {
        id: 'user_1',
        name: '我',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
      }
    ],
    isCreator: false
  }
]
