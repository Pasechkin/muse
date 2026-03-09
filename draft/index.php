<?
   $no_breadcrumb="Y";
   require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
   $APPLICATION->SetPageProperty("og:image", "/img/family-portrait.jpg");
   require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
   
   $APPLICATION->SetPageProperty("description", "Художник нарисует для Вас семейный портрет и напечатает его на холсте. Посмотрите примеры, выберите стиль и пришлите фото.");
   $APPLICATION->SetPageProperty("title", "Семейный портрет по фото на холсте — заказать в Muse");
   $APPLICATION->SetTitle("Title");

   use Bitrix\Main\Page\Asset;
 
   Asset::getInstance()->addJs('/js/flickity.pkgd.min.js');
   Asset::getInstance()->addCss('/css/flickity.min.css');
   Asset::getInstance()->addCss('/css/jquery.fancybox.min.css');
   Asset::getInstance()->addJs('/js/jquery.fancybox.min.js');
   Asset::getInstance()->addJs('/js/granim.min.js');


   $PRODUCT_ID=8350;
   include $_SERVER["DOCUMENT_ROOT"]."/grid/grid.3.php";
   $MUSE_FILTER = "семейный";
   $MUSE_LIMIT = 36;

   Asset::getInstance()->addCss('/local/vendor/fileuploader/css/jquery.fileuploader.min.css');
   $CALCULATOR_NAME = 'foto-na-kholste';   //начальный калькулятор   
   //пока все не проверим новая версия лежит отдельно в папке calc.stage
   $scripts = '<script src="/calc.stage/nmQuickCalc.typed.min.js"></script><script src="/local/vendor/fileuploader/js/jquery.fileuploader.min.js"></script>
                <script>window.CALCULATOR_NAME = "'.$CALCULATOR_NAME.'";</script>';

   $APPLICATION->AddViewContent('scripts', $scripts);
?>
 <div itemscope itemtype=http://schema.org/Product>
   <header class=main-container>
      <section class="imagebg section--ken-burns" data-overlay="4">
         <div class="background-image-holder"> <img alt="Портрет семьи из четырех человек" title="Семейный портрет" itemprop="image" src="/upload/img/family-portrait.webp"> </div>
         <div class=container>
            <div class=row>
               <div class=col-sm-10>
                  <div class=mt--2>
                     <?$APPLICATION->IncludeComponent("bitrix:breadcrumb", "breadcrumbs", array("PATH" => "",
                        "START_FROM" => "0",
                        "COMPONENT_TEMPLATE" => "breadcrumbs",
                        "SITE_ID" => "s1",
                        "COMPOSITE_FRAME_MODE" => "A",
                        "COMPOSITE_FRAME_TYPE" => "AUTO"
                        ),
                        false
                        );?>
                     <h1 itemprop=name>Семейный портрет</h1>
                     <p class=lead itemprop=description>Художник нарисует для Вас семейный портрет и напечатает его на холсте.<br>Посмотрите примеры, выберите стиль и пришлите фото
                     <div itemscope itemtype=http://schema.org/Offer itemprop=offers>
                        <p class=lead>От 5271 руб. Под заказ.</p>
                        <meta content="5271.00" itemprop=price>
                        <meta content="RUB" itemprop=priceCurrency>
                        <link href="https://muse.ooo/portret-na-zakaz/semeynyy-portret/"  itemprop=url>
                        <meta content="2026-12-31" itemprop=priceValidUntil>
                        <link itemprop="availability" href="http://schema.org/InStock"/>
                     </div>
                     <a href="/order/" class="btn btn--primary type--uppercase make-order my"><span class=btn__text>Заказать</span></a>
                  </div>
               </div>
               <p></p>
            </div>
         </div>
      </section>
   </header>
   <main>
      <?$APPLICATION->IncludeFile(SITE_TEMPLATE_PATH."/includes/accio_regions.php",Array(),Array("MODE" => "php","NAME"      => "блок Акция"));?>
      <a href=#style></a>
      <section сlass="space--xxs" id=style>
         <div class=container>
            <div class=row>
               <div class="text-center col-sm-12">
                  <h2>Выберите свой стиль</h2>
                  <p class="lead">
                     Чтобы рассчитать стоимость, узнать о характеристиках и сроках исполнения, пожалуйста перейдите на подробную страницу стиля по ссылке «Цена». Перейти на страницу стиля можно и из раздела «Портфолио» кликнув по понравившемуся портрету. Он откроется в большом размере, и ссылка «Цена» там тоже будет.
                  <div>&nbsp;</div>
               </div>
            </div>
         </div>
         <div class="carousel min-width" data-flickity='{ "wrapAround": true, "freeScroll": true}'>
            <div class="text-center feature">
               <img title="Акварель" alt="Акварельный портрет семьи на фоне моря" class="carousel-style" src="https://muse.ooo/img/o-watercolor-12-223.jpg">
               <div>
                  <p>Акварель</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-akvarelyu/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Масло" alt="Портрет семьи из пяти человек живописью под масло" class="carousel-style" src="https://muse.ooo/img/oil-1404-4-223.jpg">
               <div>
                  <p>Маслом</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-maslom/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Карандаш" alt="Портрет семьи из пяти человек под карандаш" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/karandashom-portret-121019-223_1.jpg">
               <div>
                  <p>Карандаш</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-karandashom/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Шарж" alt="Шарж женщины с ребенком в образе кенгуру" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/o-sharzh-po-foto-3-223.jpg">
               <div>
                  <p>Шарж</p>
                  <a href=https://muse.ooo/portret-na-zakaz/sharzh-po-foto/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="В образе" alt="Портрет семьи из десяти человек и собаки в образе на основе фотомонтажа в известную картину" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/o-family-painting-223.jpg">
               <div>
                  <p>В образе</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-v-obraze/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Комикс" alt="Семейный портрет в образе героев комиксов" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/komiks-portret-041119-223.jpg">
               <div>
                  <p>Комикс</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-komiks/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="WPAP" alt="WPAP портрет на белом фоне" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/wpap-portret-160519-223.jpg">
               <div>
                  <p>WPAP</p>
                  <a href=https://muse.ooo/portret-na-zakaz/wpap-portret/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Портрет из слов" alt="Нарисованный портрет семьи из слов" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/iz-slov-portret-30919-223_1.jpg">
               <div>
                  <p>Из слов</p>
                  <a href=https://muse.ooo/portret-na-zakaz/portret-iz-slov/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Фотомозаика" alt="Фотомозаика для семьи из четырёх человек" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/fotomozaika-180719-223_1.png">
               <div>
                  <p>Фотомозаика</p>
                  <a href=https://muse.ooo/portret-na-zakaz/fotomozaika/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Поп-арт" alt="Поп-арт портрет в стиле Уорхола семьи из трех человек" class="carousel-style" decoding="async" loading="lazy" src="https://muse.ooo/img/o-pop-art-warhol-223-100.jpg">
               <div>
                  <p>Поп-арт</p>
                  <a href=https://muse.ooo/portret-na-zakaz/pop-art-portret/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
            <div class="text-center feature">
               <img title="Дрим-Арт" alt="Портрет семьи в стиле Дрим-Арт" class="carousel-style" src="https://muse.ooo/img/o-dream-art-12-223.jpg">
               <div>
                  <p>Дрим-арт</p>
                  <a href=https://muse.ooo/portret-na-zakaz/drim-art-portret/#calc>
                     <p>Цена</p>
                  </a>
               </div>
            </div>
         </div>
      </section>
      <span id=portret></span><?= renderGRID($MUSE_FILTER, 'Портфолио', 'Портреты по фото', $MUSE_LIMIT, 0, false) ?>
      <div class="text-center space--xxs bg--dark">
         <div class=container>
            <div class=row>
               <div class=col-sm-12>
                  <div class=cta><a href="https://muse.ooo/portret-na-zakaz/portret-po-foto/" class="btn btn--dark type--uppercase"><span class=btn__text>смотреть все примеры работ</span></a></div>
               </div>
            </div>
         </div>
      </div>

<!-- HTML код калькулятора -->
     <section class="space--xxs calc-loader" data-name="<?=$CALCULATOR_NAME?>">
         <div class=container>
            <div class=row>
               <div class="text-center col-sm-12">
                  <p>Если калькулятор не загружается ниже, пожалуйста, сообщите нам об этом. Быстро сообщим стоимость печати на холсте именнВас и сделаем скидку.</p>
               </div>
               <div class="col-sm-12 " >
                  <div class=text-center>загрузка<br>
                     <span class="typed-text typed-text--cursor" data-typed-strings=". . . . . . . . . . . "></span>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <section class="section section-calculator" id=calc>
         <div class="container">
            <div class="row">
               <div class="col-sm-12 text-center">
                  <h2>Цена</h2>
                  <div>&nbsp;</div>
               </div>
            </div>
            <!-- код виджета выбора калькулятора  data-names - список названий конфигураций калькулятора -->
            <div class="container space--xxs calc-selector" data-names="foto-na-kholste,portret-na-zakaz"
data-project="%7B%22image%22:%22https://muse.ooo/upload/imgsite/family-458-611.webp%22%7D"
 > </div>
            <!-- /код виджета выбора калькулятора  -->
         </div>
         <form  id="vertical-order-form" name="vertical-order-form" method="post" 
                role="form" action="https://muse.ooo/ajax/makeorder.php" class="form-email" 
                data-error="Пожалуйста, заполните обязательные поля" 
                data-success-redirect="https://muse.ooo/Спасибо_за_ваш_заказ/" data-success="Спасибо за Ваш заказ">
            <?=bitrix_sessid_post()?>
            <input type="hidden" name="order-botcheck" value="">
            <input type="hidden" name="order-widget" value="1">
            <input type="hidden" name="order-product" id="order-product" value="<?=$PRODUCT_ID?>">
            <div id="container-calc" class="container open-calculator"  data-name="<?=$CALCULATOR_NAME?>" data-paspartu-overflow="true" data-target="container-calc"></div>
            <!--end of container-->
         </form>
      </section>
      <!-- /HTML код калькулятора -->

      <a href=#review></a>
      <section class="text-center space--xxs bg--secondary"id=review>
         <div class=container>
            <div class=row>
               <div class=col-sm-12>
                  <h2>Отзывы</h2>
               </div>
            </div>
            <div class=container><?$APPLICATION->IncludeFile(
               SITE_TEMPLATE_PATH."/includes/socreviews.php",
               ["PRODUCT_ID" => $PRODUCT_ID],
               [
                "MODE"        => "php",
                "NAME"        => "Отзывы",
                "SHOW_BORDER" => false
               ]
               ) ?></div>
         </div>
      </section>
      <div class=space--xxs>
         <div class=container>
            <div class=row>
               <div class=col-sm-12>
                  <div class="boxed cta cta--horizontal cta-1 text-center-xs">
                     <div class="text-center col-sm-6">
                        <span class=h4>Создай своё произведение искусства</span> 
                        <meta content=8350 itemprop=sku>
                        <meta content=No itemprop=mpn>
                        <p itemprop=brand itemscope itemtype=http://schema.org/Brand>
                           <meta content=Muse itemprop=name>
                     </div>
                     <div class="text-center col-sm-3 col-xs-12">
                        <a href="/order/" class="btn btn--primary make-order my type--uppercase btn--sm">
                           <div class="btn__text btn-my">ЗАКАЗАТЬ</div>
                        </a>
                     </div>
                     <div class="text-center col-sm-3 col-xs-12">
                        <a href=#callback class="bg--dark btn btn--sm">
                           <div class="btn__text btn-my">ОБРАТНЫЙ ЗВОНОК</div>
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </main>
</div>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
